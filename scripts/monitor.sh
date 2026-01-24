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
