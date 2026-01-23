# みずきクリニック ホームページ

## 概要

みずきクリニックのホームページプロジェクト。[Next.js 15](https://nextjs.org/)をベースに構築し、App Routerを採用。React、MUI、Tailwind CSSを使用。

### 主な機能
- クリニック紹介・診療案内ページ
- 院長俳句展（縦書き表示、旧サイトからの移行データ含む）
- お知らせ管理（管理画面からCRUD操作）
- ブログ（俳句）投稿管理
- お問い合わせフォーム（reCAPTCHA v3 + Azure MSAL メール送信）
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
| next | next_app | 2999:3000 | Next.jsアプリケーション |
| mysql | mysql_db | 3306 | MySQL 8.0 データベース |
| nginx | nginx_proxy | 80:80 | リバースプロキシ |

### アーキテクチャ

```
[ブラウザ] → [nginx:80] → [next:3000] → [mysql:3306]
```

## 環境変数の設定

`next/.env`ファイルに以下を設定：

```env
# 認証
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:2999

# データベース
DATABASE_URL=mysql://app_user:app_pass@mysql:3306/app_db

# Google OAuth（オプション）
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

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
- Nginx（リバースプロキシ）
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
| `/doctor` | 院長紹介 |
| `/services` | 診療案内 |
| `/access` | アクセス |
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

## 院長俳句展について

旧サイト（mizuki-clinic.jp）から23件の俳句データを移行済み。新規投稿はDBで管理し、旧データと統合して表示。

- 縦書き表示（`writing-mode: vertical-rl`）
- 5-7-5の段下げ表示（0, 2em, 4em）
- 句集（年月別アーカイブ）フィルタ機能
- 旧サイトの画像は wixstatic.com から参照

## その他設定

### Azure MSAL（問い合わせメール）

MS 365との連携でお問い合わせメール送信。

### reCAPTCHA v3

問い合わせフォームのスパム対策として導入。

### Sitemap

`next-sitemap`で自動生成。Google Search Consoleに登録済み。

### 外部画像ドメイン

`next.config.ts` の `remotePatterns` に以下を許可：
- `mizuki-clinic.online`（自サイト）
- `static.wixstatic.com`（旧サイト俳句画像）

## ライセンス

このプロジェクトはみずきクリニックに帰属します。
