# みずきクリニック ホームページ

## 概要

みずきクリニックのホームページプロジェクト。[Next.js 15](https://nextjs.org/)をベースに構築し、App Routerを採用。React、MUI、Tailwind CSSを使用。

### 主な機能
- クリニック紹介・診療案内ページ
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
| next | next_app | 2999:3000 | Next.jsアプリケーション (512MB) |
| mysql | mysql_db | 3306 | MySQL 8.0 データベース (256MB) |
| nginx | nginx_proxy | 80, 443 | リバースプロキシ + SSL終端 |
| certbot | certbot | - | Let's Encrypt 証明書管理 |

### アーキテクチャ

```
[ブラウザ] → [nginx:443 SSL] → [next:3000] → [mysql:3306]
                ↓
         [certbot: Let's Encrypt]
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

GitHub Actionsによる自動デプロイ（`.github/workflows/deploy_production.yml`）：

1. `develop` → `main` へのPRをマージ（または手動実行）
2. lint実行
3. Dockerイメージをビルドし、GitHub Container Registry（ghcr.io）にプッシュ
4. 本番サーバーへSSH接続し、最新イメージをpull & 起動
5. Prismaマイグレーション自動実行

### 手動デプロイ

```bash
ssh your-server
cd ~/mizuki-hp
git pull origin main
docker compose pull
docker compose up -d
docker compose exec next npx prisma migrate deploy
```

### SSL証明書 (初回)

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d mizuki-clinic.online \
  --agree-tos --email <メールアドレス>
docker compose restart nginx
```

### SSL証明書更新 (月1回cron推奨)

```bash
docker compose run --rm certbot renew --quiet
docker compose restart nginx
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
│   └── default.conf.template   # Nginx設定テンプレート
├── mysql/
│   └── data/                   # MySQLデータ（gitignore）
└── next/
    ├── Dockerfile              # Next.jsコンテナ設定
    ├── .env                    # 環境変数（gitignore）
    ├── prisma/
    │   ├── schema.prisma       # DBスキーマ定義
    │   └── migrations/         # マイグレーション履歴
    └── src/
        ├── app/
        │   ├── page.tsx            # トップページ
        │   ├── blog/               # 院長俳句展
        │   ├── news/               # お知らせ一覧
        │   ├── contact/            # お問い合わせ
        │   ├── portal-login/       # 管理者ログイン
        │   ├── portal-admin/       # 管理者ポータル
        │   │   ├── page.tsx        # ダッシュボード
        │   │   ├── blog/           # 俳句投稿管理
        │   │   ├── news/           # お知らせ管理
        │   │   └── inquiry/        # お問い合わせ一覧
        │   └── api/
        │       ├── blog/           # 俳句 CRUD API
        │       ├── news/           # お知らせ CRUD API
        │       ├── email/          # メール送信・一覧 API
        │       ├── admin/          # 管理者 API
        │       └── recaptcha/      # reCAPTCHA検証
        ├── components/             # 共通コンポーネント
        ├── lib/                    # ユーティリティ
        └── theme/                  # MUIテーマ設定
```

## ページ一覧

| パス | 内容 |
|------|------|
| `/` | トップページ |
| `/blog` | 院長俳句展（縦書き、5-7-5段下げ表示） |
| `/news` | お知らせ一覧 |
| `/contact` | お問い合わせフォーム |
| `/consultation` | 診療時間 |
| `/doctor` | 院長紹介 |
| `/services` | 診療案内 |
| `/access` | アクセス |
| `/endoscopy` | 内視鏡検査 |
| `/online` | オンライン診療 |
| `/recruit` | 採用情報 |
| `/portal-login` | 管理者ログイン |
| `/portal-admin` | 管理ダッシュボード |
| `/portal-admin/blog` | 俳句投稿管理 |
| `/portal-admin/news` | お知らせ管理 |
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

## セキュリティ対策

- **認証:** 強力な AUTH_SECRET (base64 32byte) / bcrypt パスワードハッシュ
- **API保護:** ADMIN ロールチェック (News CRUD, 問い合わせ削除, アップロード)
- **レート制限:** お問い合わせAPI (3回/分)、reCAPTCHA API (5回/分) にIPベースの制限
- **アップロード:** 認証必須 / ファイル形式制限 (JPEG, PNG, GIF, WebP) / 5MB制限 / ランダムファイル名
- **Nginx:** セキュリティヘッダー (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP) / バージョン情報非表示
- **CSP:** Content-Security-Policy でスクリプト・スタイル・画像の読み込み元を制限
- **フォーム:** reCAPTCHA v3 / XSS サニタイズ (xss) / バリデーション
- **SSL:** Let's Encrypt + HTTP→HTTPS自動リダイレクト
- **DB:** 強固なパスワード設定 / 自動バックアップ (7日間保持)

## 運用スクリプト

`scripts/` ディレクトリにサーバー運用スクリプトを配置。

### SSL証明書自動更新

```bash
# 手動実行
./scripts/renew-ssl.sh

# cron設定（毎月1日 3:00）
0 3 1 * * /root/mizuki-hp/scripts/renew-ssl.sh >> /var/log/certbot-renew.log 2>&1
```

### DBバックアップ

```bash
# 手動実行
./scripts/backup-db.sh

# cron設定（毎日 4:00）
0 4 * * * /root/mizuki-hp/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
```

バックアップは `backups/` に `app_db_YYYYMMDD_HHMMSS.sql.gz` として保存。7日間保持。

### サーバー監視一括セットアップ

```bash
sudo bash scripts/setup-monitoring.sh
```

以下をまとめてインストール・設定:

| ツール | 機能 | 動作 |
|--------|------|------|
| monitor.sh | サービス死活監視 | 5分ごとにコンテナ状態チェック、ダウン時メール通知＋自動復旧 |
| fail2ban | 不正アクセスブロック | SSH: 3回失敗→24h BAN / Nginx: bot・404連打をブロック |
| logwatch | 日次ログレポート | 毎朝7:00にログサマリーをメール送信 |

### fail2ban 操作

```bash
fail2ban-client status          # 全jail一覧
fail2ban-client status sshd     # SSH jail詳細
fail2ban-client unban <IP>      # 手動解除
```

設定ファイル: `fail2ban/jail.local`, `fail2ban/filter.d/nginx-404.conf`

### Logwatch

設定ファイル: `logwatch/logwatch.conf`
手動実行: `logwatch --output stdout --detail High`

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
