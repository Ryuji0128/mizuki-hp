# 復旧手順（ディザスタリカバリ）

本番サーバーを失った場合、または特定時点へ巻き戻す場合の手順。

> **前提**: バックアップは復元できて初めて意味を持つ。この手順は
> ローカル開発環境への実復元で検証済み（[検証記録](#検証記録)参照）。

---

## 復旧に必要なものと入手元

| 要素 | 入手元 | 備考 |
|---|---|---|
| アプリコード | GitHub `seta-seisakusyo/mizuki-hp` | |
| DBスキーマ | 同上 `next/prisma/migrations/` | `prisma migrate deploy` で適用 |
| Dockerイメージ | ghcr.io（SHAタグ） | 特定バージョンへの巻き戻しも可能 |
| **DBデータ** | ローカルPC `C:\backups\mizuki-hp\db\` | 日次・30日分 |
| **画像 (uploads)** | ローカルPC `C:\backups\mizuki-hp\uploads\` | 追記のみ（削除を伝播しない） |
| **秘密情報** | ローカルPC `C:\backups\mizuki-hp\secrets\` | **暗号化済み。パスフレーズが別途必要** |
| パスフレーズ | **パスワードマネージャ** | サーバー上の `~/.backup-passphrase` は同時に失われる前提 |
| SSL証明書 | 再取得（Let's Encrypt） | `.env` の `CERTBOT_DOMAINS` 設定済み |

> **最重要**: パスフレーズをパスワードマネージャに保管していないと、
> 秘密情報のバックアップがあっても復号できない。サーバーと一緒に失われるため。

---

## 1. 秘密情報の復号

ローカルPC（Git Bash）で実行する。

```bash
cd /c/backups/mizuki-hp/secrets
ls -t *.enc | head -1                     # 最新を確認

openssl enc -d -aes-256-cbc -pbkdf2 -in secrets-YYYYMMDDTHHMMSSZ.tar.gz.enc \
  -out secrets.tar.gz                     # パスフレーズを入力
tar -xzf secrets.tar.gz
```

展開される内容:

| ファイル | 復元先 |
|---|---|
| `.env` | `~/mizuki-hp/.env` |
| `next/.env` | `~/mizuki-hp/next/.env` |
| `msmtprc` | `/etc/msmtprc`（600 root）と `~/.msmtprc`（600 ubuntu）の両方 |
| `crontab.txt` | `crontab crontab.txt` で復元 |

---

## 2. サーバーの再構築

```bash
# 前提: Docker / docker compose 導入済み、SSHポートは非標準に変更
git clone https://github.com/seta-seisakusyo/mizuki-hp.git ~/mizuki-hp
cd ~/mizuki-hp

# 手順1で復号した .env / next/.env を配置
# 実行権限を確認（git 側で 100755 管理だが念のため）
ls -la scripts/
```

`docker-compose.yml` は `.env` の `SERVER_NAME` / `CERTBOT_DOMAINS` / `CERTBOT_EMAIL` を参照する。
未設定だと証明書取得が `-d localhost` になって失敗するため、必ず復元してから起動する。

---

## 3. データベースの復元

```bash
# MySQL だけ先に起動
docker compose up -d mysql
until docker compose exec -T mysql mysqladmin ping -h localhost -u root -p"${MYSQL_ROOT_PASSWORD:-root}" --silent; do sleep 2; done

# スキーマを作る
docker compose run --rm next node node_modules/prisma/build/index.js migrate deploy

# データを流し込む（PCから転送したダンプ）
gzip -dc app_db_YYYYMMDD_HHMMSS.sql.gz | docker compose exec -T mysql mysql -u root -proot app_db
```

**確認:**

```bash
docker compose exec -T mysql mysql -u root -proot app_db \
  -e "SELECT COUNT(*) FROM Blog; SELECT COUNT(*) FROM News;"
```

俳句の件数が想定どおりか確認する。

### 俳句だけを戻す場合

`backups/haiku/` のアーカイブには `blog.sql.gz`（Blogテーブルのみ）が入っている。

```bash
tar -xzf mizuki-haiku-full-YYYYMMDDTHHMMSSZ.tar.gz
cat manifest.json                      # includesUploads を確認
gzip -dc blog.sql.gz | docker compose exec -T mysql mysql -u root -proot app_db
```

---

## 4. 画像の復元

```bash
# PCから転送する場合
scp -r /c/backups/mizuki-hp/uploads/* <server>:~/mizuki-hp/uploads/

# 週次アーカイブから戻す場合（includesUploads: true のもの）
tar -xzf mizuki-haiku-full-YYYYMMDDTHHMMSSZ.tar.gz
mkdir -p ~/mizuki-hp/uploads
tar -xzf uploads.tar.gz -C ~/mizuki-hp/uploads
```

---

## 5. 起動と証明書取得

```bash
docker compose up -d next nginx

# 証明書を取得（nginx は証明書が無ければ自動でHTTPのみで起動する）
docker compose --profile ssl run --rm certbot
docker compose restart nginx
```

---

## 6. 監視・バックアップの再設定

```bash
sudo bash scripts/setup-monitoring.sh      # msmtp / fail2ban / logwatch / cron

# パスフレーズを復元（パスワードマネージャの値）
echo '<パスフレーズ>' > ~/.backup-passphrase && chmod 600 ~/.backup-passphrase

# logrotate は Docker 対応版に差し替える（標準版はコンテナにシグナルを送れない）
sudo cp logrotate/nginx-docker.conf /etc/logrotate.d/nginx
```

---

## 7. 復旧確認

```bash
# 外部から
curl -sI https://mizuki-clinic.jp/ | head -1
curl -s https://mizuki-clinic.jp/api/health
echo | openssl s_client -connect mizuki-clinic.jp:443 -servername mizuki-clinic.jp 2>/dev/null \
  | openssl x509 -noout -dates

# サーバー内で
docker compose ps
./scripts/renew-ssl.sh                 # 「更新不要」が出れば正常
./scripts/backup-secrets.sh            # 復号検証まで通れば正常
systemctl is-active fail2ban
```

ローカルPCから `scripts/local/check-site.ps1` を実行し、4項目すべて正常なら完了。

---

## 定期的な復元テスト

**バックアップは復元を試すまで、動いているかどうか分からない。**
半年に1回程度、ローカル開発環境へ実際に復元することを推奨する。

```bash
# ローカル開発環境のDBを空にして復元テスト
docker exec mysql_db_dev mysql -u root -proot -e "DROP DATABASE app_db; CREATE DATABASE app_db;"
gzip -dc C:/backups/mizuki-hp/db/app_db_XXXXXXXX.sql.gz | docker exec -i mysql_db_dev mysql -u root -proot app_db
docker restart next_app_dev
# http://localhost:3100/blog で俳句が表示されることを確認
```

---

## 検証記録

| 日付 | 内容 | 結果 |
|---|---|---|
| 2026-08-24 | ローカル開発環境のDBを `DROP DATABASE` で全消去 → PC上のバックアップから復元 | ✅ Blog 137 / News 1 / Inquiry 1 / User 1 が復元、日本語も正常 |
| 2026-08-24 | 復元後のアプリ表示確認 | ✅ `http://localhost:3100/blog` が HTTP 200、俳句カード6件表示 |
| 2026-08-24 | 暗号化された秘密情報をPC単体で復号 | ✅ `.env` / `next/.env` / `msmtprc` / `crontab.txt` を復元 |
| 2026-08-24 | pull の差分取得 | ✅ 初回101秒(333MB) → 2回目4.5秒(0MB) |

次回の実施目安: 2027-02（半年後）
