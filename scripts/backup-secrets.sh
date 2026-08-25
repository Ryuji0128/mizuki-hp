#!/bin/bash
# 秘密情報・サーバー設定のバックアップスクリプト
#
# cron設定例 (毎日 4:30):
#   30 4 * * * /home/ubuntu/mizuki-hp/scripts/backup-secrets.sh >> /home/ubuntu/mizuki-hp/logs/backup-secrets.log 2>&1
#
# 対象:
#   .env / next/.env      アプリの環境変数 (AUTH_SECRET, SMTP, reCAPTCHA 等)
#   ~/.msmtprc            メール送信設定 (/etc/msmtprc と同内容だが root 権限不要で読める)
#   crontab -l            cron 定義
#
# これらは GitHub にも Docker イメージにも入っていないため、
# サーバーを失うと再構築できない。にもかかわらず従来どのバックアップ対象でもなかった。
#
# 出力は必ず暗号化する。平文のままローカルPCへ同期すると、
# PC側が新たな漏洩経路になるため。
#
# パスフレーズ:
#   ~/.backup-passphrase (chmod 600) から読む。このファイルはPCへ同期しないこと。
#   同じ値をパスワードマネージャにも保管しておく。サーバー全損時に
#   パスフレーズが手元に無ければ、バックアップがあっても復号できない。
#
# 復号:
#   openssl enc -d -aes-256-cbc -pbkdf2 -in secrets-*.tar.gz.enc -out secrets.tar.gz
#   tar -xzf secrets.tar.gz

set -euo pipefail

cd "$(dirname "$0")/.."

# 多重起動を防ぐ。
# root と一般ユーザーの cron に同じスクリプトが登録されていると、
# 同じ秒に起動して同名ファイルを奪い合い、両方失敗して
# バックアップが1件も残らない事故が起きる（実際に発生した）。
LOCK_FILE="${MIZUKI_BACKUP_SECRETS_LOCK:-/tmp/mizuki-backup-secrets.lock}"
exec 9>"$LOCK_FILE" 2>/dev/null || true
if command -v flock >/dev/null 2>&1; then
  if ! flock -n 9; then
    echo "[$(date)] 別のプロセスが実行中のためスキップ: 秘密情報バックアップ"
    exit 0
  fi
fi


BACKUP_DIR="${SECRETS_BACKUP_DIR:-./backups/secrets}"
PASSPHRASE_FILE="${SECRETS_PASSPHRASE_FILE:-$HOME/.backup-passphrase}"
KEEP="${SECRETS_BACKUP_KEEP:-10}"

if [ ! -f "$PASSPHRASE_FILE" ]; then
  echo "[$(date)] ERROR: パスフレーズファイルがありません: ${PASSPHRASE_FILE}"
  echo "  作成例: openssl rand -base64 32 > ${PASSPHRASE_FILE} && chmod 600 ${PASSPHRASE_FILE}"
  echo "  作成した値は必ずパスワードマネージャにも保管してください。"
  exit 1
fi

# パスフレーズが他ユーザーから読めるなら暗号化の意味がない
perms=$(stat -c %a "$PASSPHRASE_FILE")
if [ "$perms" != "600" ] && [ "$perms" != "400" ]; then
  echo "[$(date)] ERROR: ${PASSPHRASE_FILE} の権限が ${perms} です。600 にしてください。"
  exit 1
fi

mkdir -p "$BACKUP_DIR"
DATE=$(date -u +%Y%m%dT%H%M%SZ)
OUT="${BACKUP_DIR}/secrets-${DATE}.tar.gz.enc"
TMP_DIR=$(mktemp -d)

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

# 収集 (存在しないものは黙って飛ばす)
for f in .env next/.env; do
  if [ -f "$f" ]; then
    mkdir -p "${TMP_DIR}/$(dirname "$f")"
    cp "$f" "${TMP_DIR}/$f"
  fi
done

[ -f "$HOME/.msmtprc" ] && cp "$HOME/.msmtprc" "${TMP_DIR}/msmtprc"
crontab -l > "${TMP_DIR}/crontab.txt" 2>/dev/null || true

cat > "${TMP_DIR}/manifest.json" <<EOF
{
  "schemaVersion": 1,
  "source": "mizuki-hp-secrets",
  "createdAt": "${DATE}",
  "hostname": "$(hostname)"
}
EOF

# 収集できたか確認 (manifest だけなら失敗扱い)
count=$(find "$TMP_DIR" -type f ! -name manifest.json | wc -l)
if [ "$count" -eq 0 ]; then
  echo "[$(date)] ERROR: バックアップ対象のファイルが1つも見つかりませんでした"
  exit 1
fi

tar -czf "${TMP_DIR}/../secrets-${DATE}.tar.gz" -C "$TMP_DIR" .
openssl enc -aes-256-cbc -pbkdf2 -salt \
  -in "${TMP_DIR}/../secrets-${DATE}.tar.gz" \
  -out "$OUT" \
  -pass file:"$PASSPHRASE_FILE"
rm -f "${TMP_DIR}/../secrets-${DATE}.tar.gz"
chmod 600 "$OUT"

# 復号できることをその場で検証する。
# 壊れた暗号文を保存し続けるのが最悪のパターンなので、必ず確認する。
if ! openssl enc -d -aes-256-cbc -pbkdf2 -in "$OUT" -pass file:"$PASSPHRASE_FILE" \
     | tar -tzf - > /dev/null 2>&1; then
  echo "[$(date)] ERROR: 作成した暗号化アーカイブを復号できません: $OUT"
  rm -f "$OUT"
  exit 1
fi

ls -1t "$BACKUP_DIR"/secrets-*.tar.gz.enc 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f

echo "[$(date)] Secrets backup created: $OUT ($(du -h "$OUT" | cut -f1), ${count} files, 復号検証OK)"
