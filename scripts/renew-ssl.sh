#!/bin/bash
# SSL証明書自動更新スクリプト
# cron設定例: 0 3 1 * * /path/to/mizuki-hp/scripts/renew-ssl.sh >> /var/log/certbot-renew.log 2>&1

cd "$(dirname "$0")/.."

docker compose run --rm certbot renew --quiet
docker compose restart nginx

echo "[$(date)] SSL certificate renewal completed."
