#!/bin/bash
# Haiku backup script for host cron.
# Example cron: 30 3 * * * cd /home/ubuntu/mizuki-hp && ./scripts/backup-haiku.sh >> /tmp/mizuki-haiku-backup.log 2>&1
#
# 日次と週次で保存する内容を分けている。
#
#   日次 (mizuki-haiku-backup-*.tar.gz) : blog.sql.gz + manifest.json のみ (約11KB)
#   週次 (mizuki-haiku-full-*.tar.gz)   : 上記 + uploads.tar.gz            (約336MB)
#
# 以前は uploads を毎日フルアーカイブしており、336MB の画像に対して
# 9.6GB (約29倍) を消費していた。画像はほとんど変化しないため週次で十分。

set -euo pipefail

cd "$(dirname "$0")/.."

# 多重起動を防ぐ。
# root と一般ユーザーの cron に同じスクリプトが登録されていると、
# 同じ秒に起動して同名ファイルを奪い合い、両方失敗して
# バックアップが1件も残らない事故が起きる（実際に発生した）。
LOCK_FILE="${MIZUKI_BACKUP_HAIKU_LOCK:-/tmp/mizuki-backup-haiku.lock}"
exec 9>"$LOCK_FILE" 2>/dev/null || true
if command -v flock >/dev/null 2>&1; then
  if ! flock -n 9; then
    echo "[$(date)] 別のプロセスが実行中のためスキップ: 俳句バックアップ"
    exit 0
  fi
fi


BACKUP_DIR="${HAIKU_BACKUP_DIR:-./backups/haiku}"
ENV_FILE="${HAIKU_BACKUP_COMPOSE_ENV_FILE:-./.env}"
# 日次(DBのみ)の保持日数
KEEP_DAYS="${HAIKU_BACKUP_KEEP_DAYS:-30}"
# 週次(uploads込み)の保持世代数
KEEP_FULL="${HAIKU_BACKUP_KEEP_FULL:-4}"
# 週次を作る間隔(日)
FULL_INTERVAL_DAYS="${HAIKU_BACKUP_FULL_INTERVAL_DAYS:-7}"

read_env_value() {
  local file="$1"
  local key="$2"
  grep -E "^${key}=" "$file" | tail -n 1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

if [ -f "$ENV_FILE" ]; then
  MYSQL_DATABASE="${MYSQL_DATABASE:-$(read_env_value "$ENV_FILE" "MYSQL_DATABASE" || true)}"
  MYSQL_USER="${MYSQL_USER:-$(read_env_value "$ENV_FILE" "MYSQL_USER" || true)}"
  MYSQL_PASSWORD="${MYSQL_PASSWORD:-$(read_env_value "$ENV_FILE" "MYSQL_PASSWORD" || true)}"
fi

MYSQL_DATABASE="${MYSQL_DATABASE:-app_db}"
MYSQL_USER="${MYSQL_USER:-app_user}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-app_pass}"

mkdir -p "$BACKUP_DIR"

# 直近の週次バックアップが FULL_INTERVAL_DAYS より古ければ uploads も含める。
# 曜日ではなく経過日数で判定するので、実行が飛んだ日があっても取りこぼさない。
include_uploads=0
if [ -z "$(find "$BACKUP_DIR" -maxdepth 1 -type f -name 'mizuki-haiku-full-*.tar.gz' \
            -mtime -"$FULL_INTERVAL_DAYS" -print -quit)" ]; then
  include_uploads=1
fi

DATE=$(date -u +%Y%m%dT%H%M%SZ)
if [ "$include_uploads" -eq 1 ]; then
  BACKUP_FILE="${BACKUP_DIR}/mizuki-haiku-full-${DATE}.tar.gz"
else
  BACKUP_FILE="${BACKUP_DIR}/mizuki-haiku-backup-${DATE}.tar.gz"
fi
TMP_DIR="${BACKUP_DIR}/.mizuki-haiku-backup-${DATE}"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$TMP_DIR"

docker compose exec -T \
  -e MYSQL_PWD="$MYSQL_PASSWORD" \
  mysql mysqldump \
  --no-tablespaces \
  -u "$MYSQL_USER" \
  "$MYSQL_DATABASE" \
  Blog | gzip > "${TMP_DIR}/blog.sql.gz"

# パイプラインでは $? が gzip の結果になるため、dump 側を PIPESTATUS で確認する
dump_status=${PIPESTATUS[0]}
if [ "$dump_status" -ne 0 ]; then
  echo "[$(date)] ERROR: mysqldump failed (exit ${dump_status})"
  exit 1
fi

files='"blog.sql.gz"'
if [ "$include_uploads" -eq 1 ]; then
  if [ -d ./uploads ]; then
    tar -czf "${TMP_DIR}/uploads.tar.gz" -C ./uploads .
  else
    tar -czf "${TMP_DIR}/uploads.tar.gz" --files-from /dev/null
  fi
  files='"blog.sql.gz", "uploads.tar.gz"'
fi

cat > "${TMP_DIR}/manifest.json" <<EOF
{
  "schemaVersion": 2,
  "source": "mizuki-hp-haiku-cron",
  "createdAt": "${DATE}",
  "database": "${MYSQL_DATABASE}",
  "includesUploads": $([ "$include_uploads" -eq 1 ] && echo true || echo false),
  "files": [${files}]
}
EOF

tar -czf "$BACKUP_FILE" -C "$TMP_DIR" .

# 日次(DBのみ)は日数で、週次(uploads込み)は世代数で保持する
find "$BACKUP_DIR" -maxdepth 1 -type f -name 'mizuki-haiku-backup-*.tar.gz' -mtime +"$KEEP_DAYS" -delete
ls -1t "$BACKUP_DIR"/mizuki-haiku-full-*.tar.gz 2>/dev/null | tail -n +$((KEEP_FULL + 1)) | xargs -r rm -f

trap - EXIT
cleanup

if [ "$include_uploads" -eq 1 ]; then
  echo "[$(date)] Haiku backup created (weekly, with uploads): $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
else
  echo "[$(date)] Haiku backup created (daily, db only): $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
fi
