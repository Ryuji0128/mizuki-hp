#!/bin/bash
# サーバー監視ツール一括セットアップスクリプト
# 使用方法: sudo bash scripts/setup-monitoring.sh
#
# インストール対象:
#   1. msmtp (メール送信)
#   2. fail2ban (不正アクセスブロック)
#   3. logwatch (日次ログレポート)
#   4. サービス監視cron

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ALERT_EMAIL="info@setaseisakusyo.com"

echo "=== みずきクリニック サーバー監視セットアップ ==="
echo ""

# ---- 対話式入力 ----
read -sp "メール送信用パスワード (info@setaseisakusyo.com): " MAIL_PASSWORD
echo ""
read -p "SSHポート番号: " SSH_PORT
echo ""

# ---- 1. msmtp (メール送信) ----
echo "[1/4] msmtp インストール..."
apt-get update -qq
apt-get install -y -qq msmtp msmtp-mta

cat > /etc/msmtprc << EOF
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        default
host           mail1042.onamae.ne.jp
port           465
tls_starttls   off
from           info@setaseisakusyo.com
user           info@setaseisakusyo.com
password       ${MAIL_PASSWORD}
EOF

chmod 600 /etc/msmtprc

# cron を実行する一般ユーザーからも送れるようにする。
# /etc/msmtprc は 600 root のため一般ユーザーは読めず、monitor.sh の通知が
# 全て失敗する（実際にこれで障害通知が一通も届いていなかった）。
CRON_USER="${SUDO_USER:-ubuntu}"
CRON_HOME="$(getent passwd "$CRON_USER" | cut -d: -f6)"
if [ -n "$CRON_HOME" ] && [ -d "$CRON_HOME" ]; then
  cp /etc/msmtprc "${CRON_HOME}/.msmtprc"
  # logfile は root 以外書けないため無効化する
  sed -i 's#^logfile .*#logfile        ~/.msmtp.log#' "${CRON_HOME}/.msmtprc"
  chown "$CRON_USER" "${CRON_HOME}/.msmtprc"
  chmod 600 "${CRON_HOME}/.msmtprc"
  echo "  ✓ ${CRON_HOME}/.msmtprc を作成 (cron ユーザー用)"
fi

# 認証が通るかここで必ず検証する。
# パスワード誤りに気づかないと、監視も fail2ban の通知も全て黙って死ぬ。
echo "  → メール送信テスト中..."
if printf 'Subject: [setup] mizuki-hp 監視セットアップ
From: monitor@%s
To: %s

セットアップ時の疎通確認メールです。
'     "$(hostname)" "$ALERT_EMAIL" | msmtp "$ALERT_EMAIL" 2>/tmp/msmtp-test.err; then
  echo "  ✓ メール送信成功 (${ALERT_EMAIL} を確認してください)"
else
  echo "  ✗ メール送信に失敗しました。パスワードを確認してください:"
  sed 's/^/      /' /tmp/msmtp-test.err
  echo "      → このままだと障害通知が一切届きません。"
fi
rm -f /tmp/msmtp-test.err
echo "  ✓ msmtp 設定完了"

# ---- 2. fail2ban ----
echo "[2/4] fail2ban インストール..."
apt-get install -y -qq fail2ban

# 設定ファイルコピー
cp "${PROJECT_DIR}/fail2ban/jail.local" /etc/fail2ban/jail.local
cp "${PROJECT_DIR}/fail2ban/filter.d/nginx-404.conf" /etc/fail2ban/filter.d/nginx-404.conf
cp "${PROJECT_DIR}/fail2ban/filter.d/nginx-proxy.conf" /etc/fail2ban/filter.d/nginx-proxy.conf

# SSHポートを設定
sed -i "s/port = ssh/port = ${SSH_PORT}/" /etc/fail2ban/jail.local

# nginxログディレクトリ作成
mkdir -p /var/log/nginx

# nginx は Docker コンテナのため、Ubuntu 標準の logrotate 設定
# (postrotate の invoke-rc.d) ではログを再オープンできない。
# 再オープンされないと access.log が空のままになり、fail2ban が
# 何も検知できなくなる（実際に84日間 nginx 系 jail が無効化されていた）。
if [ -f "${PROJECT_DIR}/logrotate/nginx-docker.conf" ]; then
  cp /etc/logrotate.d/nginx /etc/logrotate.d/nginx.bak 2>/dev/null || true
  cp "${PROJECT_DIR}/logrotate/nginx-docker.conf" /etc/logrotate.d/nginx
  echo "  ✓ logrotate の nginx 設定を Docker 対応版に置換"
fi

# fail2ban 起動
systemctl enable fail2ban
systemctl restart fail2ban
echo "  ✓ fail2ban 設定完了"

# ---- 3. logwatch ----
echo "[3/4] logwatch インストール..."
apt-get install -y -qq logwatch

mkdir -p /etc/logwatch/conf
cp "${PROJECT_DIR}/logwatch/logwatch.conf" /etc/logwatch/conf/logwatch.conf

echo "  ✓ logwatch 設定完了"

# ---- 4. cron 設定 ----
echo "[4/4] cron 設定..."

# ログ出力先 (/var/log は root 所有で一般ユーザーの cron から書けないため)
mkdir -p "${PROJECT_DIR}/logs"
chown "$(stat -c %U "${PROJECT_DIR}")" "${PROJECT_DIR}/logs" 2>/dev/null || true

# 既存のmizuki関連cronを削除して再設定
crontab -l 2>/dev/null | grep -v "mizuki" | grep -v "logwatch" > /tmp/crontab.tmp || true

cat >> /tmp/crontab.tmp << CRON
# === mizuki-clinic.jp 監視 ===
# サービス死活監視 + SSL有効期限監視 (5分ごと)
*/5 * * * * MONITOR_LOG_FILE=${PROJECT_DIR}/logs/monitor.log ${PROJECT_DIR}/scripts/monitor.sh >> ${PROJECT_DIR}/logs/monitor-cron.log 2>&1
# SSL証明書自動更新 (毎日 3:00)
# certbot は残り30日未満の証明書のみ更新するため、毎日実行しても無駄な更新は走らない。
# 月1回だと1度の失敗でそのまま失効するため、必ず毎日実行すること。
0 3 * * * ${PROJECT_DIR}/scripts/renew-ssl.sh >> ${PROJECT_DIR}/certbot-renew.log 2>&1
# DBフルバックアップ (毎日 4:00 / 30日間保持 / 1件16KB程度)
0 4 * * * ${PROJECT_DIR}/scripts/backup-db.sh >> ${PROJECT_DIR}/logs/db-backup.log 2>&1
# 俳句バックアップ (毎日 4:15 / DBのみ。uploads は週次で自動的に含まれる)
15 4 * * * cd ${PROJECT_DIR} && ./scripts/backup-haiku.sh >> ${PROJECT_DIR}/logs/haiku-backup.log 2>&1
# 秘密情報・サーバー設定のバックアップ (毎日 4:30 / 暗号化)
# .env や msmtprc は GitHub にもイメージにも無く、失うと再構築できない
30 4 * * * ${PROJECT_DIR}/scripts/backup-secrets.sh >> ${PROJECT_DIR}/logs/backup-secrets.log 2>&1
# Logwatch日次レポート (毎朝 7:00)
0 7 * * * /usr/sbin/logwatch --output mail
CRON

crontab /tmp/crontab.tmp
rm /tmp/crontab.tmp
echo "  ✓ cron 設定完了"

# ---- スクリプト実行権限 ----
chmod +x "${PROJECT_DIR}"/scripts/*.sh

echo ""
echo "=== セットアップ完了 ==="
echo ""
echo "設定済み:"
echo "  • サービス監視: 5分ごとにコンテナ状態チェック → ダウン時メール通知"
echo "  • fail2ban: SSH(3回失敗→24h BAN) / Nginx不正アクセスブロック"
echo "  • logwatch: 毎朝7:00にログサマリーを ${ALERT_EMAIL} に送信"
echo "  • SSL更新: 毎日 3:00 (残り30日未満で自動更新 / 失敗時はメール通知)"
echo "  • DBバックアップ: 毎日 4:00 (30日保持)"
echo "  • 俳句バックアップ: 毎日 4:15 (uploads は週次)"
echo "  • 秘密情報バックアップ: 毎日 4:30 (暗号化)"
echo ""
echo "確認コマンド:"
echo "  fail2ban-client status         # fail2ban状態"
echo "  fail2ban-client status sshd    # SSH jail詳細"
echo "  crontab -l                     # cron一覧"
echo "  cat /var/log/mizuki-monitor.log # 監視ログ"
echo "  tail -50 ${PROJECT_DIR}/certbot-renew.log # SSL更新ログ"
