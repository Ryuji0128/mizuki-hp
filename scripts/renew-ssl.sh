#!/bin/bash
# SSL証明書自動更新スクリプト
#
# cron設定例 (毎日3:00):
#   0 3 * * * /path/to/mizuki-hp/scripts/renew-ssl.sh >> /var/log/certbot-renew.log 2>&1
#
# 注意: certbot は「残り30日未満」の証明書のみ更新する。
#       毎日実行しても不要な更新は走らず、Let's Encrypt のレート制限にも当たらない。
#       月1回実行だと1度の失敗で失効するため、必ず毎日実行すること。

set -uo pipefail

cd "$(dirname "$0")/.." || exit 1

ALERT_EMAIL="${ALERT_EMAIL:-info@setaseisakusyo.com}"
HOSTNAME_FQDN="$(hostname)"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# 失敗時のメール通知 (msmtp が無い環境ではログのみ)
alert() {
  local subject="$1" body="$2"
  log "ALERT: ${subject}"
  if command -v msmtp >/dev/null 2>&1; then
    printf 'Subject: [ALERT] %s\nFrom: monitor@%s\nTo: %s\n\n%s\n' \
      "$subject" "$HOSTNAME_FQDN" "$ALERT_EMAIL" "$body" | msmtp "$ALERT_EMAIL" || true
  fi
}

log "SSL証明書の更新チェックを開始"

# certbot サービスは profiles: ["ssl"] のため --profile ssl が必須
renew_output="$(docker compose --profile ssl -f docker-compose.yml run --rm certbot renew 2>&1)"
renew_status=$?

echo "$renew_output"

if [ $renew_status -ne 0 ]; then
  alert "SSL証明書の更新に失敗しました (${HOSTNAME_FQDN})" \
"サーバー: ${HOSTNAME_FQDN}
検知時刻: $(date)
終了コード: ${renew_status}

--- certbot 出力 ---
${renew_output}

対応: サーバーにログインして以下を実行してください
  cd ~/mizuki-hp
  docker compose --profile ssl -f docker-compose.yml run --rm certbot renew"
  exit 1
fi

# 実際に更新された場合のみ nginx に反映する
# (certbot は更新不要なら 'No renewals were attempted' 等を出力して正常終了する)
if echo "$renew_output" | grep -q "not yet due for renewal"; then
  log "更新不要 (有効期限に余裕あり)。nginx はそのまま。"
  exit 0
fi

log "証明書が更新されました。nginx をリロードします"
if ! docker compose -f docker-compose.yml restart nginx; then
  alert "証明書更新後の nginx 再起動に失敗しました (${HOSTNAME_FQDN})" \
"サーバー: ${HOSTNAME_FQDN}
検知時刻: $(date)

新しい証明書は取得できていますが nginx に反映されていません。
  cd ~/mizuki-hp && docker compose restart nginx"
  exit 1
fi

log "SSL証明書の更新が完了しました"
