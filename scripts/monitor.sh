#!/bin/bash
# サービス死活監視スクリプト
#
# cron設定例:
#   */5 * * * * MONITOR_LOG_FILE=/home/ubuntu/mizuki-hp/logs/monitor.log /home/ubuntu/mizuki-hp/scripts/monitor.sh
#
# 必要: msmtp (メール送信用)
# インストール: apt install msmtp msmtp-mta
# 注意: /etc/msmtprc が 600 root の場合、一般ユーザーからは読めず送信が全て失敗する。
#       その場合は ~/.msmtprc を用意するか /etc/msmtprc に読み取り権限を付ける。

cd "$(dirname "$0")/.."

ALERT_EMAIL="${ALERT_EMAIL:-info@setaseisakusyo.com}"
HOSTNAME=$(hostname)
# /var/log は root 所有のため、ubuntu ユーザーの cron では書けない。
# cron 側から MONITOR_LOG_FILE で書き込み可能なパスを指定する。
LOG_FILE="${MONITOR_LOG_FILE:-/var/log/mizuki-monitor.log}"

# チェック対象コンテナ
CONTAINERS=("next_app" "mysql_db" "nginx_proxy")

# 通知の重複抑制 (同種のアラートは ALERT_INTERVAL 秒に1回まで)
# 5分ごとの実行なので、これが無いと障害時にメールが延々と飛び続ける
ALERT_INTERVAL="${ALERT_INTERVAL:-3600}"
STAMP_DIR="${STAMP_DIR:-/tmp/mizuki-alert-stamps}"
mkdir -p "$STAMP_DIR"

should_alert() {
  local stamp="${STAMP_DIR}/$1"
  if [ -f "$stamp" ]; then
    local age=$(( $(date +%s) - $(stat -c %Y "$stamp" 2>/dev/null || echo 0) ))
    [ "$age" -lt "$ALERT_INTERVAL" ] && return 1
  fi
  touch "$stamp"
  return 0
}

clear_alert() { rm -f "${STAMP_DIR}/$1"; }

# メール送信関数
# msmtp の失敗を必ずログに残す。通知基盤が壊れていることに気づけないと
# 監視そのものが無意味になるため、送信失敗を握りつぶさない。
send_alert() {
  local subject="$1"
  local body="$2"
  local err

  if ! command -v msmtp >/dev/null 2>&1; then
    echo "[$(date)] ALERT SEND FAILED (msmtp 未導入): ${subject}" >> "$LOG_FILE"
    return 1
  fi

  if err=$(printf 'Subject: [ALERT] %s\nFrom: monitor@%s\nTo: %s\n\n%b\n' \
      "$subject" "$HOSTNAME" "$ALERT_EMAIL" "$body" | msmtp "$ALERT_EMAIL" 2>&1); then
    echo "[$(date)] ALERT SENT: ${subject}" >> "$LOG_FILE"
  else
    # 例: /etc/msmtprc が読めない、SMTP認証失敗(535) など
    echo "[$(date)] ALERT SEND FAILED: ${subject} -- ${err}" >> "$LOG_FILE"
    return 1
  fi
}

# コンテナ状態チェック
for container in "${CONTAINERS[@]}"; do
  status=$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null)

  if [ "$status" != "true" ]; then
    if should_alert "down-${container}"; then
      send_alert "${container} がダウンしています" \
        "サーバー: ${HOSTNAME}\nコンテナ: ${container}\n状態: 停止\n検知時刻: $(date)\n\n自動復旧を試みます..."
    fi

    # 自動復旧は通知のスロットルとは独立に毎回試みる
    docker compose up -d "$container" 2>> "$LOG_FILE"
    echo "[$(date)] ${container} の復旧を試行しました" >> "$LOG_FILE"
  else
    clear_alert "down-${container}"
  fi
done

# ディスク容量チェック (90%超で警告)
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -gt 90 ]; then
  if should_alert "disk"; then
    send_alert "ディスク容量警告 (${disk_usage}%)" \
      "サーバー: ${HOSTNAME}\nディスク使用率: ${disk_usage}%\n検知時刻: $(date)\n\n不要ファイルの削除を検討してください。"
  fi
else
  clear_alert "disk"
fi

# メモリチェック (空きが100MB未満で警告)
free_mem=$(free -m | awk 'NR==2 {print $7}')
if [ "$free_mem" -lt 100 ]; then
  if should_alert "memory"; then
    send_alert "メモリ不足警告 (空き${free_mem}MB)" \
      "サーバー: ${HOSTNAME}\n空きメモリ: ${free_mem}MB\n検知時刻: $(date)"
  fi
else
  clear_alert "memory"
fi

# ----------------------------------
# SSL証明書の有効期限チェック
# ----------------------------------
# 実際に配信されている証明書を見るため、ファイルではなく443番ポートに接続して確認する。
# (「更新は成功したが nginx にリロードされていない」ケースも検知できる)
#
# 補足: Let's Encrypt は2025-06-04で失効通知メールを廃止し、アカウントの
#       contact も保存しなくなった。期限監視は自前で行うしかない。
CERT_DOMAIN="${CERT_DOMAIN:-mizuki-clinic.jp}"
CERT_WARN_DAYS="${CERT_WARN_DAYS:-20}"
cert_days=""

cert_end=$(echo | timeout 15 openssl s_client -connect "${CERT_DOMAIN}:443" \
  -servername "${CERT_DOMAIN}" 2>/dev/null \
  | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

if [ -z "$cert_end" ]; then
  cert_msg="証明書の取得に失敗しました (${CERT_DOMAIN}:443 に接続できません)"
else
  cert_end_epoch=$(date -d "$cert_end" +%s 2>/dev/null)
  if [ -n "$cert_end_epoch" ]; then
    cert_days=$(( (cert_end_epoch - $(date +%s)) / 86400 ))
    cert_msg="残り ${cert_days} 日 (有効期限: ${cert_end})"
  else
    cert_msg="有効期限の解析に失敗しました (${cert_end})"
  fi
fi

if [ -z "$cert_days" ] || [ "$cert_days" -lt "$CERT_WARN_DAYS" ]; then
  if should_alert "cert"; then
    send_alert "SSL証明書の期限が迫っています (${CERT_DOMAIN}: ${cert_days:-不明}日)" \
      "サーバー: ${HOSTNAME}\nドメイン: ${CERT_DOMAIN}\n状態: ${cert_msg}\n検知時刻: $(date)\n\n自動更新(cron: renew-ssl.sh)が失敗している可能性があります。\n\n確認:\n  tail -50 ~/mizuki-hp/certbot-renew.log\n  ls -la ~/mizuki-hp/scripts/\n\n手動更新:\n  cd ~/mizuki-hp\n  docker compose --profile ssl -f docker-compose.yml run --rm certbot renew\n  docker compose restart nginx"
  fi
else
  clear_alert "cert"
fi
