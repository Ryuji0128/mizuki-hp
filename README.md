# みずきクリニック ホームページ

## 概要

みずきクリニックのホームページプロジェクト。[Next.js 15](https://nextjs.org/)をベースに構築し、App Routerを採用。React、MUI、Tailwind CSSを使用。

### 主な機能
- クリニック紹介・診療案内ページ
- 内視鏡検査・在宅医療・ワクチン接種の案内
- オンライン診療の案内
- 院長俳句展（縦書き表示、旧サイトからの移行データ含む）
- お知らせ管理（管理画面からCRUD操作）
- ブログ（俳句）投稿管理
- お問い合わせフォーム（reCAPTCHA v3 + nodemailer SMTP送信）
- 管理者ポータル（認証付き）

## 目次

- [クイックスタート](#クイックスタート)
- [Docker環境の構成](#docker環境の構成)
- [環境変数の設定](#環境変数の設定)
- [開発コマンド](#開発コマンド)
- [本番デプロイ](#本番デプロイ)
- [主要技術スタック](#主要技術スタック)
- [ディレクトリ構成](#ディレクトリ構成)
- [開発ルール](#開発ルール)
- [DB運用](#db運用)
- [セキュリティ](#セキュリティ)
- [運用スクリプト](#運用スクリプト)
- [その他設定](#その他設定)

## クイックスタート

### 必要条件

- Docker
- Docker Compose

### セットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/Ryuji0128/mizuki-hp.git
cd mizuki-hp

# 2. 環境変数ファイルを配置
cp next/.env.example next/.env
# .envファイルを編集して必要な値を設定

# 3. Docker環境を起動
docker compose up -d

# 4. ブラウザでアクセス
# http://localhost:80 (Nginx経由)
# http://localhost:2999 (Next.js直接)
```

### 停止

```bash
docker compose down
```

## Docker環境の構成

| サービス | コンテナ名 | ポート | 説明 |
|---------|-----------|--------|------|
| next | next_app | 2999:3000 | Next.js（standalone / ghcr.ioからpull） |
| mysql | mysql_db | 3306 | MySQL 8.0 データベース (256MB) |
| nginx | nginx_proxy | 80, 443 | リバースプロキシ（SSL対応） |
| certbot | certbot | - | SSL証明書管理 |

### アーキテクチャ（本番）

```
[ブラウザ] → [nginx:443] → [next:3000] → [mysql:3306]
              ↑ SSL/TLS
         [certbot] (証明書更新)
```

### ボリューム

- `./uploads` → Next.js + Nginx で画像ファイルを永続化・配信
- `./certbot/conf` → SSL証明書
- `./mysql/data` → DBデータ

## 環境変数の設定

`next/.env`ファイルに以下を設定：

```env
# 認証
AUTH_SECRET=<openssl rand -base64 32 で生成>
NEXTAUTH_URL=http://localhost:3000

# データベース
DATABASE_URL=mysql://app_user:app_pass@mysql:3306/app_db

# メール送信 (nodemailer)
CONTACT_TO_EMAIL=info@example.com
SMTP_HOST=mail.example.com
SMTP_PORT=465
SMTP_USER=info@example.com
SMTP_PASS=your-smtp-password

# reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

本番環境では `docker-compose.yml` の `environment` で `NEXTAUTH_URL=https://mizuki-clinic.online` が上書きされる。

## 開発コマンド

```bash
# コンテナ起動
docker compose up -d

# コンテナ停止
docker compose down

# ログ確認
docker compose logs -f        # 全コンテナ
docker compose logs -f next   # Next.jsのみ

# コンテナ再ビルド（Dockerfile変更時）
docker compose up -d --build

# Prismaマイグレーション
docker compose exec next npx prisma migrate dev

# Prismaクライアント再生成
docker compose exec next npx prisma generate

# コンテナ内でシェル実行
docker compose exec next sh
```

## 本番デプロイ

GitHub Actionsによる自動デプロイ：

1. `develop` → `main` へのPRをマージ（または手動実行）
2. Lint実行
3. マルチステージビルドでDockerイメージをビルド & ghcr.ioにpush
4. 本番サーバーでイメージをpull & 起動
5. SSL証明書の自動取得/更新
6. Prismaマイグレーション自動実行

### Dockerイメージ

マルチステージビルドにより軽量イメージを生成。本番サーバーではpullのみ行い、ビルドは行わない。

### SSL証明書の自動管理

デプロイ時に以下の処理が自動実行されます：

- **初回デプロイ**: Let's Encrypt から SSL 証明書を自動取得
- **2回目以降**: 証明書の有効期限をチェックし、必要に応じて更新

nginx は証明書の有無を自動判定：
- 証明書なし → HTTP のみで起動
- 証明書あり → HTTPS 有効、HTTP→HTTPS リダイレクト

### 手動デプロイ

```bash
ssh your-server
cd ~/mizuki-hp
git pull origin main
docker compose pull
docker compose up -d
```

## 主要技術スタック

### フロントエンド
- TypeScript
- React 19
- Next.js 15 (App Router)
- MUI (Material UI)
- Tailwind CSS
- Framer Motion

### バックエンド
- Next.js API Routes
- Prisma ORM
- Auth.js (NextAuth)
- MySQL 8.0

### インフラ
- Docker / Docker Compose
- Nginx（リバースプロキシ + SSL終端）
- Let's Encrypt / Certbot（SSL証明書）
- さくらVPS 1GB
- GitHub Actions (CI/CD)
- GitHub Container Registry (ghcr.io)

## ディレクトリ構成

```
mizuki-hp/
├── docker-compose.yml          # Docker Compose設定
├── .github/workflows/          # GitHub Actions
│   └── deploy_production.yml   # 本番デプロイワークフロー
├── nginx/
│   ├── default.conf.template   # Nginx設定テンプレート
│   └── docker-entrypoint.sh    # SSL自動判定スクリプト
├── mysql/
│   └── data/                   # MySQLデータ（gitignore）
├── fail2ban/                   # fail2ban設定
│   ├── jail.local              # メイン設定
│   └── filter.d/               # フィルター定義
│       ├── nginx-404.conf      # 404連打検出
│       └── nginx-proxy.conf    # プロキシスキャン検出
├── logwatch/                   # logwatch設定
│   └── logwatch.conf           # レポート設定
├── scripts/                    # 運用スクリプト
│   ├── renew-ssl.sh            # SSL証明書更新
│   ├── backup-db.sh            # DBバックアップ
│   ├── monitor.sh              # サービス監視
│   └── setup-monitoring.sh     # 監視セットアップ
├── certbot/                    # SSL証明書（gitignore）
│   ├── conf/                   # Let's Encrypt設定
│   └── www/                    # チャレンジ用
└── next/
    ├── Dockerfile              # Next.jsコンテナ設定
    ├── .env                    # 環境変数（gitignore）
    ├── prisma/
    │   ├── schema.prisma       # DBスキーマ定義
    │   └── migrations/         # マイグレーション履歴
    └── src/
        ├── app/                # ページ・APIルート
        ├── components/         # 共通コンポーネント
        ├── lib/                # ユーティリティ（rateLimit含む）
        └── theme/              # MUIテーマ設定
```

## ページ一覧

### 公開ページ

| パス | 内容 |
|------|------|
| `/` | トップページ |
| `/discription` | クリニック概要 |
| `/consultation` | 診療案内・診療時間 |
| `/endoscopy` | 内視鏡検査 |
| `/home-medical-care` | 在宅医療 |
| `/vaccine` | ワクチン接種 |
| `/doctor` | 医師紹介 |
| `/access` | アクセス |
| `/contact` | お問い合わせフォーム |
| `/online` | オンライン診療 |
| `/blog` | 院長俳句展（縦書き、5-7-5段下げ表示） |
| `/blog/[year]/[month]` | 俳句アーカイブ（年月別） |
| `/news` | お知らせ一覧 |
| `/recruit` | 採用情報 |
| `/company` | 会社概要 |
| `/services` | サービス案内 |
| `/privacy-policy` | プライバシーポリシー |
| `/terms-of-service` | 利用規約 |

### 管理者ページ

| パス | 内容 |
|------|------|
| `/portal-login` | 管理者ログイン |
| `/portal-admin` | 管理ダッシュボード |
| `/portal-admin/blog` | 俳句投稿管理 |
| `/portal-admin/blog/new` | 俳句新規作成 |
| `/portal-admin/blog/edit/[id]` | 俳句編集 |
| `/portal-admin/news` | お知らせ管理 |
| `/portal-admin/news/new` | お知らせ新規作成 |
| `/portal-admin/news/edit/[id]` | お知らせ編集 |
| `/portal-admin/inquiry` | お問い合わせ一覧 |

## DBスキーマ

### Blog（俳句）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | Int | 主キー |
| title | String | 俳句タイトル |
| content | String | 本文（5-7-5改行区切り） |
| imageUrl | String? | 画像URL |
| imagePosition | String | 画像表示位置（default: center） |
| createdAt | DateTime | 作成日 |
| updatedAt | DateTime | 更新日 |

### News（お知らせ）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | Int | 主キー |
| title | String | タイトル |
| content | String | 本文 |
| color | String? | 表示カラー |
| pinned | Boolean | ピン留め |
| createdAt | DateTime | 作成日 |
| updatedAt | DateTime | 更新日 |

### Email（お問い合わせ）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | Int | 主キー |
| name | String | 名前 |
| email | String | メールアドレス |
| phone | String? | 電話番号 |
| content | String | 問い合わせ内容 |
| createdAt | DateTime | 受信日 |

## 開発ルール

### ブランチ運用

- `main` - 本番環境
- `develop` - 開発統合ブランチ
- `feature/*` - 新機能開発
- `fix/*` - バグ修正

### ブランチ命名規則

```
feature/0034_create-top-page
fix/0035_login-error
```

### プルリクエスト

1. `develop`から作業ブランチを作成
2. 実装・コミット
3. `develop`へPR作成
4. レビュー後マージ
5. `develop` → `main`へPRでリリース

## DB運用

### スキーマ変更時

```bash
# 1. schema.prismaを編集

# 2. マイグレーション作成
docker compose exec next npx prisma migrate dev --name your_migration_name

# 3. クライアント再生成（自動で実行されるが念のため）
docker compose exec next npx prisma generate
```

### トラブルシューティング

```bash
# Prismaキャッシュクリア
docker compose exec next sh -c "rm -rf node_modules/.prisma && npx prisma generate"

# DB接続確認
docker compose exec mysql mysql -u app_user -papp_pass app_db
```

## レスポンシブ対応

全ページでモバイル（~640px）・タブレット（~1024px）・デスクトップに対応。

### 俳句一覧 (`/blog`)
- モバイル: 2カラムグリッド、縦書きエリア縮小（160px）、アーカイブは横スクロールのピル型フィルター
- デスクトップ: 3カラム + 右サイドバー（句集アーカイブ）

### 診療時間 (`/consultation`)
- テーブルが画面幅に収まらない場合は横スクロール対応
- モバイル: セルpadding・丸印サイズ・フォントサイズ縮小

### お問い合わせ (`/contact`)
- フォーム幅・余白がモバイルに合わせて自動調整

### 画像表示
- アップロード画像は `unoptimized` でNginxから直接配信（Next.js Image最適化をバイパス）
- wixstatic画像はNext.js Image最適化を使用

## 院長俳句展について

旧サイト（mizuki-clinic.jp）から23件の俳句データを移行済み。新規投稿はDBで管理し、旧データと統合して表示。

- 縦書き表示（`writing-mode: vertical-rl`）
- 5-7-5の段下げ表示（0, 2em, 4em）
- 句集（年月別アーカイブ）フィルタ機能
- 旧サイトの画像は wixstatic.com から参照

## セキュリティ

### 実装済みセキュリティ機能

| 機能 | 説明 |
|-----|------|
| NextAuth認証 | bcryptによるパスワードハッシュ / 強力な AUTH_SECRET (base64 32byte) |
| ユーザーロール | ADMIN / VIEWER |
| レート制限 | IP単位でのリクエスト制限（お問い合わせ: 3回/分、reCAPTCHA: 5回/分） |
| API保護 | ADMIN権限チェック（Blog/News CRUD、問い合わせ削除、アップロード） |
| reCAPTCHA v3 | フォームスパム対策 |
| XSSサニタイズ | xssパッケージによる入力サニタイズ（email, blog, news） |
| アップロード | 認証+ADMIN権限 / MIME制限 (JPEG, PNG, GIF, WebP) / 5MB制限 / UUIDファイル名 |
| SSL | Let's Encrypt + HTTP→HTTPS自動リダイレクト |
| DB | 強固なパスワード設定 / 自動バックアップ (7日間保持) |

### Nginx セキュリティヘッダー

`nginx/docker-entrypoint.sh`でHTTPS有効時に以下を設定：

| ヘッダー | 値 | 効果 |
|---------|-----|------|
| `X-Frame-Options` | SAMEORIGIN | クリックジャッキング防止 |
| `X-Content-Type-Options` | nosniff | MIMEスニッフィング防止 |
| `X-XSS-Protection` | 1; mode=block | XSS攻撃防止 |
| `Referrer-Policy` | strict-origin-when-cross-origin | リファラー情報制限 |
| `Strict-Transport-Security` | max-age=31536000 | HTTPS強制（HSTS） |
| `Content-Security-Policy` | script/style/img-src制限 | コンテンツインジェクション防止 |

### fail2ban

SSH/Nginxへの不正アクセス対策：

| jail | フィルター | 検出対象 | maxretry | bantime |
|------|-----------|---------|----------|---------|
| sshd | sshd | SSH不正ログイン | 3 | 24h |
| nginx-badbots | apache-badbots | 悪意のあるBot | 2 | 24h |
| nginx-404 | nginx-404 | 404連打 | 10 | 1h |
| nginx-http-auth | nginx-http-auth | 認証失敗 | 3 | 24h |
| nginx-proxy | nginx-proxy | プロキシスキャン・脆弱性探索 | 2 | 24h |
| nginx-limit-req | nginx-limit-req | レート制限超過 | 10 | 2h |

```bash
# 設定ファイルをコピー
sudo cp fail2ban/jail.local /etc/fail2ban/
sudo cp fail2ban/filter.d/* /etc/fail2ban/filter.d/

# 再起動
sudo systemctl restart fail2ban
```

### logwatch

日次ログレポート：

```bash
# 設定ファイルをコピー
sudo cp logwatch/logwatch.conf /etc/logwatch/conf/

# テスト実行
sudo logwatch --output stdout
```

## 運用スクリプト

`scripts/`ディレクトリに運用スクリプトを配置：

| スクリプト | 説明 |
|-----------|------|
| `renew-ssl.sh` | SSL証明書の更新 |
| `backup-db.sh` | DBバックアップ（7日間保持） |
| `monitor.sh` | サービス死活監視 |
| `setup-monitoring.sh` | 監視環境セットアップ |

### SSL証明書更新

```bash
# 手動実行
./scripts/renew-ssl.sh

# cron設定（毎日3時に実行）
0 3 * * * /root/mizuki-hp/scripts/renew-ssl.sh >> /var/log/ssl-renew.log 2>&1
```

### DBバックアップ

```bash
# 手動実行
./scripts/backup-db.sh

# cron設定（毎日2時に実行）
0 2 * * * /root/mizuki-hp/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

バックアップは `backups/` に `app_db_YYYYMMDD_HHMMSS.sql.gz` として保存。7日間保持。

### サービス監視

```bash
# 監視セットアップ
sudo bash scripts/setup-monitoring.sh

# 死活監視実行
./scripts/monitor.sh
```

### fail2ban 操作

```bash
fail2ban-client status          # 全jail一覧
fail2ban-client status sshd     # SSH jail詳細
fail2ban-client unban <IP>      # 手動解除
```

## その他設定

### メール送信 (nodemailer)

SMTP経由でお問い合わせメール送信（管理者通知 + 自動返信）。

### reCAPTCHA v3

問い合わせフォームのスパム対策。Google reCAPTCHA管理画面でサイトキーを取得し`.env`に設定。

### Sitemap

`next-sitemap`で自動生成。Google Search Consoleに登録済み。

### 外部画像ドメイン

`next.config.ts` の `remotePatterns` に以下を許可：
- `mizuki-clinic.online`（自サイト）
- `static.wixstatic.com`（旧サイト俳句画像）

## ライセンス

このプロジェクトはみずきクリニックに帰属します。
