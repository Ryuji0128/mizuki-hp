#!/bin/bash
# MySQLバックアップスクリプト
# cron設定例: 0 4 * * * /path/to/mizuki-hp/scripts/backup-db.sh

cd "$(dirname "$0")/.."

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/app_db_${DATE}.sql.gz"
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

# mysqldump実行 + gzip圧縮
docker compose exec -T mysql mysqldump \
  -u "${MYSQL_USER:-app_user}" \
  -p"${MYSQL_PASSWORD:-app_pass}" \
  "${MYSQL_DATABASE:-app_db}" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup created: $BACKUP_FILE"
else
  echo "[$(date)] ERROR: Backup failed!"
  exit 1
fi

# 古いバックアップを削除
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +${KEEP_DAYS} -delete
echo "[$(date)] Old backups (>${KEEP_DAYS} days) removed."
