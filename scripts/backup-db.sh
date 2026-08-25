#!/bin/bash
set -euo pipefail
umask 077

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

: "${MYSQL_PASSWORD:?MYSQL_PASSWORD must be set in .env}"
MYSQL_USER="${MYSQL_USER:-app_user}"
MYSQL_DATABASE="${MYSQL_DATABASE:-app_db}"

LOCK_FILE="${MIZUKI_BACKUP_DB_LOCK:-/tmp/mizuki-backup-db.lock}"
exec 9>"$LOCK_FILE"
if command -v flock >/dev/null 2>&1 && ! flock -n 9; then
  echo "[$(date)] Another DB backup is already running; skipped."
  exit 0
fi

BACKUP_DIR="${DB_BACKUP_DIR:-./backups}"
PASSPHRASE_FILE="${DB_BACKUP_PASSPHRASE_FILE:-$HOME/.backup-passphrase}"
KEEP_DAYS="${DB_BACKUP_KEEP_DAYS:-30}"
DATE=$(date -u +%Y%m%dT%H%M%SZ)
BACKUP_FILE="${BACKUP_DIR}/app_db_${DATE}.sql.gz.enc"

if [ ! -f "$PASSPHRASE_FILE" ]; then
  echo "[$(date)] ERROR: backup passphrase file is missing: $PASSPHRASE_FILE"
  exit 1
fi

perms=$(stat -c %a "$PASSPHRASE_FILE")
if [ "$perms" != "600" ] && [ "$perms" != "400" ]; then
  echo "[$(date)] ERROR: $PASSPHRASE_FILE permissions must be 600 or 400 (current: $perms)"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

if ! docker compose exec -T -e MYSQL_PWD="$MYSQL_PASSWORD" mysql \
    mysqldump --no-tablespaces -u "$MYSQL_USER" "$MYSQL_DATABASE" \
    | gzip \
    | openssl enc -aes-256-cbc -pbkdf2 -salt -pass file:"$PASSPHRASE_FILE" \
    > "$BACKUP_FILE"; then
  echo "[$(date)] ERROR: encrypted DB backup failed"
  rm -f "$BACKUP_FILE"
  exit 1
fi

chmod 600 "$BACKUP_FILE"

if ! openssl enc -d -aes-256-cbc -pbkdf2 -in "$BACKUP_FILE" \
    -pass file:"$PASSPHRASE_FILE" \
    | gzip -dc \
    | tail -5 \
    | grep -q "Dump completed"; then
  echo "[$(date)] ERROR: encrypted DB backup verification failed: $BACKUP_FILE"
  rm -f "$BACKUP_FILE"
  exit 1
fi

echo "[$(date)] Encrypted DB backup created: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
find "$BACKUP_DIR" -name "app_db_*.sql.gz.enc" -mtime "+${KEEP_DAYS}" -delete
