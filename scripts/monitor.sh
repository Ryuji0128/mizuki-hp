#!/bin/bash
# サービス死活監視スクリプト
# cron設定例: */5 * * * * /root/mizuki-hp/scripts/monitor.sh
#
# 必要: msmtp (メール送信用)
# インストール: apt install msmtp msmtp-mta

cd "$(dirname "$0")/.."

ALERT_EMAIL="info@setaseisakusyo.com"
HOSTNAME=$(hostname)
LOG_FILE="/var/log/mizuki-monitor.log"

# チェック対象コンテナ
CONTAINERS=("next_app" "mysql_db" "nginx_proxy")

# メール送信関数
send_alert() {
  local subject="$1"
  local body="$2"

  echo -e "Subject: [ALERT] ${subject}\nFrom: monitor@${HOSTNAME}\nTo: ${ALERT_EMAIL}\n\n${body}" | msmtp "$ALERT_EMAIL"
  echo "[$(date)] ALERT SENT: ${subject}" >> "$LOG_FILE"
}

# コンテナ状態チェック
for container in "${CONTAINERS[@]}"; do
  status=$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null)

  if [ "$status" != "true" ]; then
    send_alert "${container} がダウンしています" \
      "サーバー: ${HOSTNAME}\nコンテナ: ${container}\n状態: 停止\n検知時刻: $(date)\n\n自動復旧を試みます..."

    # 自動復旧試行
    docker compose up -d "$container" 2>> "$LOG_FILE"
    echo "[$(date)] ${container} の復旧を試行しました" >> "$LOG_FILE"
  fi
done

# ディスク容量チェック (90%超で警告)
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -gt 90 ]; then
  send_alert "ディスク容量警告 (${disk_usage}%)" \
    "サーバー: ${HOSTNAME}\nディスク使用率: ${disk_usage}%\n検知時刻: $(date)\n\n不要ファイルの削除を検討してください。"
fi

# メモリチェック (空きが100MB未満で警告)
free_mem=$(free -m | awk 'NR==2 {print $7}')
if [ "$free_mem" -lt 100 ]; then
  send_alert "メモリ不足警告 (空き${free_mem}MB)" \
    "サーバー: ${HOSTNAME}\n空きメモリ: ${free_mem}MB\n検知時刻: $(date)"
fi

# ----------------------------------
# SSL証明書の有効期限チェック
# ----------------------------------
# 実際に配信されている証明書を見るため、ファイルではなく443番ポートに接続して確認する。
# (「更新は成功したが nginx にリロードされていない」ケースも検知できる)
CERT_DOMAIN="${CERT_DOMAIN:-mizuki-clinic.jp}"
CERT_WARN_DAYS="${CERT_WARN_DAYS:-20}"
# 通知の重複を防ぐスタンプ (1日1回まで)
CERT_STAMP="/tmp/mizuki-cert-alert.stamp"
cert_days=""

cert_end=$(echo | timeout 15 openssl s_client -connect "${CERT_DOMAIN}:443" \
  -servername "${CERT_DOMAIN}" 2>/dev/null \
  | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

if [ -z "$cert_end" ]; then
  cert_msg="証明書の取得に失敗しました (${CERT_DOMAIN}:443 に接続できません)"
  cert_days=""
else
  cert_end_epoch=$(date -d "$cert_end" +%s 2>/dev/null)
  if [ -n "$cert_end_epoch" ]; then
    cert_days=$(( (cert_end_epoch - $(date +%s)) / 86400 ))
    cert_msg="残り ${cert_days} 日 (有効期限: ${cert_end})"
  fi
fi

if [ -z "$cert_days" ] || [ "$cert_days" -lt "$CERT_WARN_DAYS" ]; then
  # 前回通知から24時間以上経過している場合のみ送信
  if [ ! -f "$CERT_STAMP" ] || [ "$(( $(date +%s) - $(stat -c %Y "$CERT_STAMP" 2>/dev/null || echo 0) ))" -gt 86400 ]; then
    send_alert "SSL証明書の期限が迫っています (${CERT_DOMAIN}: ${cert_days:-不明}日)" \
      "サーバー: ${HOSTNAME}\nドメイン: ${CERT_DOMAIN}\n状態: ${cert_msg}\n検知時刻: $(date)\n\n自動更新(cron: renew-ssl.sh)が失敗している可能性があります。\n\n確認:\n  tail -50 /var/log/certbot-renew.log\n  ls -la ~/mizuki-hp/scripts/\n\n手動更新:\n  cd ~/mizuki-hp\n  docker compose --profile ssl -f docker-compose.yml run --rm certbot renew\n  docker compose restart nginx"
    touch "$CERT_STAMP"
  fi
else
  rm -f "$CERT_STAMP"
fi
