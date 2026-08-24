#!/bin/bash
# MySQLバックアップスクリプト
# cron設定例: 0 4 * * * /path/to/mizuki-hp/scripts/backup-db.sh >> /path/to/mizuki-hp/logs/db-backup.log 2>&1

cd "$(dirname "$0")/.."

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/app_db_${DATE}.sql.gz"
KEEP_DAYS="${DB_BACKUP_KEEP_DAYS:-30}"

mkdir -p "$BACKUP_DIR"

# mysqldump実行 + gzip圧縮
# --no-tablespaces: app_user に PROCESS 権限が無いため、付けないと
#   'Access denied; you need (at least one of) the PROCESS privilege(s)' が出る
docker compose exec -T mysql mysqldump \
  --no-tablespaces \
  -u "${MYSQL_USER:-app_user}" \
  -p"${MYSQL_PASSWORD:-app_pass}" \
  "${MYSQL_DATABASE:-app_db}" | gzip > "$BACKUP_FILE"

# パイプラインでは $? が最後のコマンド(gzip)の終了コードになるため、
# mysqldump が失敗しても成功と誤判定される。PIPESTATUS で dump 側を確認する。
#
# 注意: PIPESTATUS は代入を含むあらゆるコマンドの実行後に更新される。
# dump_status=${PIPESTATUS[0]} を実行した時点で PIPESTATUS は (0) に置き換わり、
# 続けて ${PIPESTATUS[1]} を読むと空になる。必ず一度に配列ごとコピーする。
pipe_status=("${PIPESTATUS[@]}")
dump_status=${pipe_status[0]}
gzip_status=${pipe_status[1]}

if [ "$dump_status" -ne 0 ] || [ "$gzip_status" -ne 0 ]; then
  echo "[$(date)] ERROR: Backup failed! (mysqldump=${dump_status}, gzip=${gzip_status})"
  rm -f "$BACKUP_FILE"
  exit 1
fi

# ダンプが最後まで書き切れたかを完了マーカーで確認する
if ! zcat "$BACKUP_FILE" | tail -5 | grep -q "Dump completed"; then
  echo "[$(date)] ERROR: Backup is incomplete (完了マーカーなし): $BACKUP_FILE"
  exit 1
fi

echo "[$(date)] Backup created: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

# 古いバックアップを削除
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +${KEEP_DAYS} -delete
echo "[$(date)] Old backups (>${KEEP_DAYS} days) removed."
