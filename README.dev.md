# 開発環境セットアップガイド

## 開発環境と本番環境の違い

### 開発環境（docker-compose.dev.yml）
- コード変更がリアルタイムで反映される
- ホットリロードが有効
- `npm run dev` で起動
- MySQLデータは `mysql_dev_data` ボリュームに保存

### 本番環境（docker-compose.yml）
- 固定イメージ `ghcr.io/seta-seisakusyo/mizuki-hp:latest` を使用
- コード変更は反映されない（再ビルドが必要）
- `node server.js` で起動
- MySQLデータは `./mysql/data` に保存

## 初回セットアップ（ここでつまずきます）

`Dockerfile.dev` は **依存関係をインストールしません**。`docker-compose.dev.yml` が
`./next:/app` をバインドマウントするため、イメージ側の `node_modules` は隠れてしまい、
**ホストの `next/node_modules` がそのまま使われます**。

`next/node_modules` が無い状態で起動すると、`npx prisma generate` が
npm レジストリから **最新の Prisma（v7系）** を取得し、v6 形式のスキーマを弾いて失敗します:

```
Error code: P1012
error: The datasource property `url` is no longer supported in schema files.
Prisma CLI Version : 7.9.1          ← package.json は ^6.3.1
```

**起動前に必ず依存をインストールしてください。** ネイティブモジュール（Prisma エンジン等）を
Linux 向けに揃えるため、ホストではなく**コンテナ内**で実行します:

```bash
# corepack enable は USER node では権限エラーになるので使わない
docker compose -f docker-compose.dev.yml run --rm next   sh -c "COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack yarn@1.22.22 install --frozen-lockfile"
```

`next/.env` も必要です。`next/.env.example` をコピーして作成してください。
ローカルでは `RECAPTCHA_BYPASS=true` を入れておくとお問い合わせフォームを試せます
（`NODE_ENV=production` では無視される安全設計）。

### ポートが競合する場合

`docker-compose.dev.yml` は 3000（next）、3306（mysql）、80（nginx）を使います。
他プロジェクトと衝突する場合は `docker-compose.local.yml`（gitignore 対象）で上書きします。

**注意: compose は `ports` を「マージ」するため、単に書くと元のポートも一緒に
バインドしようとして失敗します。** `!override` でリストごと置き換えてください:

```yaml
services:
  next:
    ports: !override
      - "3100:3000"
    environment:
      - NEXTAUTH_URL=http://localhost:3100
```

```bash
docker compose -f docker-compose.dev.yml -f docker-compose.local.yml up -d next
```

`environment` は `env_file` より優先されるため、`next/.env` を書き換えずに URL を上書きできます。

## 本番データをローカルに取り込む

本番DBには**お問い合わせの個人情報（`Inquiry`）と管理者の認証情報（`User`/`Account`）**が
含まれます。UI確認が目的なら、必要なテーブルだけに絞ってください。

```bash
# 本番側: 俳句とお知らせだけをエクスポート
ssh <本番サーバー>
cd ~/mizuki-hp
. ./.env
docker compose exec -T -e MYSQL_PWD="$MYSQL_PASSWORD" mysql mysqldump --no-tablespaces --skip-add-drop-table --complete-insert -u "$MYSQL_USER" "$MYSQL_DATABASE" Blog News | gzip > /tmp/haiku-export.sql.gz

# ローカル側: 取り込み
scp <本番サーバー>:/tmp/haiku-export.sql.gz .
$env:MYSQL_ROOT_PASSWORD = (Get-Credential root).GetNetworkCredential().Password
gzip -dc haiku-export.sql.gz | docker exec -i -e "MYSQL_PWD=$env:MYSQL_ROOT_PASSWORD" mysql_db_dev mysql -u root app_db

# 画像（約336MB）
scp -C -r <本番サーバー>:'~/mizuki-hp/uploads/*' uploads/
```

取り込み後に `next` を起動すると `prisma db push` が残りのテーブルを作成します。
管理画面を触る場合はローカル用の管理者を `prisma/seed.ts` で作成してください。

## 開発環境の起動

```bash
# 開発環境を起動（certbotなし）
docker compose -f docker-compose.dev.yml up -d

# ログを確認
docker compose -f docker-compose.dev.yml logs -f next

# 停止
docker compose -f docker-compose.dev.yml down
```

## 本番環境の起動

```bash
# 本番環境を起動
docker compose up -d next mysql nginx

# SSL証明書も含めて起動
docker compose --profile ssl up -d

# 停止
docker compose down
```

## 環境変数

### 必須の環境変数（本番環境）

`next/.env` に設定:

```bash
# 管理者アカウント（seed用）
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password

# SMTP設定（お名前メール）
SMTP_HOST=smtp22.gmoserver.jp
SMTP_PORT=465
SMTP_USER=info@mizuki-clinic.jp
SMTP_PASS=your-password
CONTACT_TO_EMAIL=info@mizuki-clinic.jp

# NextAuth
AUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://mizuki-clinic.jp

# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```


## 院長俳句バックアップ

管理画面の `バックアップDL` ボタンでは、俳句投稿データの軽量JSONをダウンロードできます。画像ファイルを含めた定期バックアップは、cron から `scripts/backup-haiku.sh` を実行します。

`backup-haiku.sh` は Next.js API を経由せず、MySQL の `Blog` テーブル dump と `uploads` ディレクトリをまとめた tar.gz を作成します。

1. 手動でバックアップできることを確認します。

```bash
./scripts/backup-haiku.sh
```

2. cron に登録します。例: 毎日 3:30 に実行。

```cron
30 3 * * * cd /home/ubuntu/mizuki-hp && ./scripts/backup-haiku.sh >> /tmp/mizuki-haiku-backup.log 2>&1
```

バックアップは既定で `./backups/haiku/` に保存され、30日より古い `mizuki-haiku-backup-*.tar.gz` は削除されます。保存先や保持日数を変える場合は `HAIKU_BACKUP_DIR`、`HAIKU_BACKUP_KEEP_DAYS` を cron 側で指定してください。

バックアップAPIを cron 以外から直接呼び出したい場合のみ、`next/.env` に `HAIKU_BACKUP_TOKEN` を設定してください。

## セキュリティチェックリスト

- [ ] `ADMIN_PASSWORD` を変更済み
- [ ] `.env` ファイルを `.gitignore` に追加済み
- [ ] 本番環境では `RECAPTCHA_BYPASS` を設定しない
- [ ] `NEXTAUTH_URL` が正しいドメインを指している
- [ ] SMTP認証情報が正しい

## トラブルシューティング

### メール送信ができない

1. SMTP設定を確認:
```bash
docker exec next_app_dev printenv | grep SMTP
```

2. お名前メールのDNS設定を確認:
   - MXレコード: `mx22.gmoserver.jp`
   - SPFレコード: `v=spf1 include:spf22.gmoserver.jp ~all`

### コード変更が反映されない

開発環境を使用していることを確認:
```bash
docker compose -f docker-compose.dev.yml restart next
```

### データベースがリセットされた

開発環境は `mysql_dev_data` ボリューム、本番環境は `./mysql/data` を使用しています。
混在しないように注意してください。

### 開発環境が重い

まずCPUとメモリ、キャッシュ容量を確認:

```bash
ps -eo pid,ppid,pcpu,pmem,rss,etime,comm,args --sort=-pcpu | head -20
free -h
du -sh next/.next /home/seta/.npm
```

効果があった対処:

- VS Codeの監視対象から `node_modules`、`.next`、`mysql/data`、`certbot/conf` を除外する
- `next/.next/cache` を削除する
- npm/npxキャッシュを掃除する
- 使っていないVS Code拡張を無効化またはアンインストールする
- VS Codeで `Developer: Reload Window` を実行する

キャッシュ削除例:

```bash
# Next.jsキャッシュが通常ユーザーで消せない場合はDocker経由で削除
docker run --rm -v /home/seta/mizuki-hp/next/.next:/target nginx:1.27-alpine sh -c 'rm -rf /target/cache'

npm cache verify
npm cache clean --force
rm -rf /home/seta/.npm/_npx
```

このリポジトリでは `.vscode/settings.json` にVS Codeの監視除外設定を置いています。
Codexを使う場合、`openai.chatgpt` 拡張は残し、不要なAI拡張を同時に動かさないようにしてください。
