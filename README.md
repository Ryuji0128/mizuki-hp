<div align="center">

# SETA HP（瀬田製作所 ホームページ）

</div>
<br>

## 概要

**Fusetsu HP** は、瀬田製作所のホームページ作成に係るプロジェクトとして、[Next.js_v15](https://nextjs.org/) をベースに構築し、App Routerを搭載。また、React、MUIを中心とした、最新のフロントエンド技術を活用。

## 目次

- [Fusetsu HP（瀬田製作所 ホームページ）](#fusetsu-hp瀬田製作所-ホームページ)
  - [概要](#概要)
  - [目次](#目次)
  - [インストール](#インストール)
  - [使用方法](#使用方法)
  - [主要技術スタック](#主要技術スタック)
    - [フロントエンド](#フロントエンド)
    - [バックエンド](#バックエンド)
    - [インフラ・クラウドサービス、FE/BE共通](#インフラクラウドサービスfebe共通)
  - [ライセンス](#ライセンス)
  - [ディレクトリ階層](#ディレクトリ階層)
  - [共同開発にあたっての手順](#共同開発にあたっての手順)
  - [gloud SDKの初期設定、運用方法](#gloud-sdkの初期設定運用方法)
  - [DB設定内容、運用方法](#db設定内容運用方法)
  - [問い合わせ機能の設定に伴うAzure MSALの導入（別途、画像及び動画有り）:](#問い合わせ機能の設定に伴うazure-msalの導入別途画像及び動画有り)
    - [参考:](#参考)
    - [手順:](#手順)
  - [認証情報の取り扱いについて](#認証情報の取り扱いについて)
  - [reCaptcha v3の導入:](#recaptcha-v3の導入)
  - [Sitemap 設定](#sitemap-設定)

## インストール

1. 必要な依存パッケージをインストール

   ```bash
   yarn install
   ```

2. 環境変数を設定

- `.env` ファイルを作成し、必要な環境変数を設定。プロジェクト管理者からenvを取得し、ローカル環境上にてプロジェクトのルートディレクトリに配置
- プロジェクト管理者は、環境変数の追加があった際はSecret ManagerやYamlファイル、Cloud Build環境変数の更新を、GCPダッシュボードやコード上にて行う必要があることに留意

## 使用方法

1. アプリ内にてGoogleSDKを使用するため、以下を実行（事前に、各ユーザー毎Google CLIの利用設定が必要：[参考](./gcloud-SDK-usage.md)）:

   ```bash
   gcloud auth application-default login 
   ```
2. データベース接続のため、以下を実行:

   ```bash
   cloud-sql-proxy $SQL_CONNECTIONNAME(環境変数からコピーすること)
   ```
3. 開発サーバーを起動、若しくはプロダクションビルドを作成しアプリを起動:
   
   ```bash
   #開発サーバーの場合
   yarn dev

   #プロダクションビルドの場合
   yarn build
   yarn start
   ```

4. ブラウザで以下のURLにアクセス:

   ```
   http://localhost:3000
   ```

5. 開発途中でschema.prismaファイルを変更した際には、[DB設定内容、運用方法](#db設定内容運用方法)を参考に、マイグレーションを行う


## 主要技術スタック

### フロントエンド
- **TypeScript**: 型安全な開発
- **ESLint**: コードリントツール
- **MUI(旧Material UI)**: UI コンポーネントライブラリ
- **Tailwind CSS**: CSS フレームワーク
- **reCAPTCHA v3**: 問い合わせメール送信時のスパム対策
- **Framer Motion**: アニメーションの実装
- **Next Sitemap**: サイトマップ生成
- **Google Search Console**: サイトマップ登録

### バックエンド
- **Next.js**: React ベースのフレームワーク
- **Prisma**: ORM
- **Auth.js**: 認証ライブラリ 
- **Azure MSAL**: 問い合わせメール機能用のMS化での登録アプリ認証
- **xss**: 問い合わせメールの個人情報の取扱に係るセキュリティ向上のためのXSS保護

### インフラ・クラウドサービス、FE/BE共通
- **Google Cloud Platform (GCP)**: ホスティング、デプロイメント
- **Google App Engine**: サーバーレスアプリケーションのデプロイメント
- **Google Cloud Build**: Github連携のCI/CDパイプライン
- **Google Secret Manager**: 環境変数のセキュアな管理
- **Google Cloud SQL**: データベースのホスティング
- **Zod**: バリデーションライブラリ

## ライセンス

このプロジェクトのライセンスは、瀬田製作所に帰属します。

## ディレクトリ階層

```
FUSETSU-HP
├── .next                     # Next.jsビルドファイル
├── node_modules
├── public                    # 静的ファイル
│   ├── google****.html       # Google Search Console認証用
│   ├── sitemap.xml           # サイトマップ
│   └── sitemap-0.xml         # サイトマップ（分割ファイル）
├── prisma                    # Prisma（DB定義・マイグレーション）
│   ├── migrations            # マイグレーション履歴
│   └── schema.prisma         # Prismaスキーマ定義
├── src
│   ├── app
│   │   ├── api               # API各ルート
│   │   │   ├── auth          # 認証API
│   │   │   ├── email         # 問い合わせメール送信API
│   │   │   ├── news          # お知らせAPI
│   │   │   ├── recaptcha     # reCAPTCHA API
│   │   │   └── user          # ユーザーAPI
│   │   ├── layout.tsx        # フロントルート
│   │   ├── portal-admin      # 管理ポータル
│   │   │   └── register-user # ユーザー登録機能
│   │   ├── portal-login      # ユーザーログイン
│   │   ├── page.tsx          # トップページコンポーネント
│   │   ├── _home             # トップページコンテンツ
│   │   ├── company           # 会社概要コンテンツ
│   │   ├── services          # 事業紹介コンテンツ
│   │   ├── news              # お知らせコンテンツ
│   │   ├── recruit           # 採用情報コンテンツ
│   │   ├── contact           # お問い合わせコンテンツ
│   │   ├── privacy-policy    # プライバシーポリシーコンテンツ
│   │   ├── terms-of-service  # 利用規約コンテンツ
│   │   ├── not-found.tsx     # 404ページ
│   │   ├── globals.css       # グローバルスタイル
│   │   ├── fonts             # フォントファイル
│   │   └── favicon.ico
│   ├── components            # 共通コンポーネント
│   │   ├── Footer.tsx        # フッター
│   │   └── Header.tsx        # ヘッダー
│   ├── lib
│   │   ├── auth.ts           # 認証関連
│   │   ├── db.ts             # DB接続・管理
│   │   ├── fetchSecrets.ts   # Secret Managerから環境変数取得ミドルウェア
│   │   ├── mock.ts           # モックデータ（現在はお知らせデータのみ）
│   │   ├── msal.ts           # Azure MSAL認証ミドルウェア
│   │   └── validation.ts     # FE/BE共通バリデーション
│   └── theme
│       ├── theme.ts          # MUIテーマ設定
│       └── themeConstants.ts
├── .env
├── .eslintrc.json
├── .gcloudignore             # GCPデプロイ用ignoreファイル
├── .gitignore
├── app.prod.yaml             # GAE Productionデプロイ環境設定
├── app.staging.yaml          # GAE Stagingデプロイ環境設定
├── cloudbuild.yaml           # Cloud Build CI/CD設定
├── middleware.ts             # カスタムミドルウェア
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── yarn.lock
```

## 共同開発にあたっての手順
- Github Issue及びProjectを用いて、タスク管理を行う
- Issueは開発者若しくはプロジェクト管理者が作成し、タスクの内容、優先度、担当者、期限を設定の上、進捗別にカードを移動
- 現在、ブランチは `prod` 、 `staging`及び `dev` の3つを使用
- ブランチの切り方は、以下の通り
  - `dev` ブランチから、`feature/` または `fix/` ブランチを切る
  - ブランチ名は、`feature/` または `fix/` に続けて、自動付与されたIssue番号に、4桁となるよう前方を0で埋めアンダーバー```_```で繋ぎ、タスク名を英語で表記   
  ```
  例: feature/0034_create-top-page
  ```
- プルリクエストを作成し、プロジェクト管理者にレビューを依頼
- レビュー後、問題がなければプロジェクト管理者がマージ

## gloud SDKの初期設定、運用方法
- 別途、[gcloud-SDK-usage.md](./gcloud-SDK-usage.md)を参照

## DB設定内容、運用方法
- ローカル及び本番環境ともに、Google Cloud SQLを使用しており、DBにはMysqlを採用
- アプリ内では、Prisma ORMを使用してDB操作を行っているが、操作方法については以下のとおり
  - schema.prismaファイルにて、DBのテーブル構造を定義
  - 当該ファイルを変更した際には、`npx prisma migrate dev` コマンドを実行し、マイグレーションを行ったのち、`npx prisma generate` コマンドを実行し、Prisma Clientを再生成
  - schema.prismaの変更、上記コマンドを実行したにも関わらず、DBに変更が反映されない・エラーが発生する場合は、prismaクライアントのキャッシュが影響していることも考えられるため、以下のコマンドを実行
    ```bash
      rm -rf node_modules/.prisma
      rm -rf node_modules/@prisma
      yarn add @prisma/client
      yarn add prisma
    ```
- SQL_環境変数によって、ローカルと本番環境を別のDBに接続するよう区別しているので、Secret Managerとローカルの環境変数の差異に注意

## 問い合わせ機能の設定に伴うAzure MSALの導入（別途、画像及び動画有り）:
### 参考:
  - [記事1](https://docs.meta-inf.hu/email-this-issue/email-this-issue-for-jira-server-data-center/documentation/administration/oauth2-authorizations-in-email-this-issue/enabling-oauth2-authorization-in-your-microsoft-365-account)
  - [記事2](https://jpo365ug.connpass.com/event/142896/presentation/)
  - [記事3](https://www.desknets.com/neo/download/doc/oauth/microsoft365.html)

### 手順:
- MS 365 Admin Centerのメーラー専用ユーザーを作成し、Email App権限内Authenticated SMTPにチェックを入れて許可
- MS Entra Admin Centerにて、Azure MSALを使用するための登録アプリを作成
- 作成済みアプリの設定画面にて、Cretificate & Secretsにて新たにSecretを作成し、クライアントID、シークレットID、テナントIDを取得
- シークレットIDは有効期限があるため、有効期限切れの場合は再取得が必要
- 同設定画面内API permissionsにて、MS GraphのApplication Permissionsを選択し、Mail.Sendとuser.Readのアクセス許可を設定
- 管理者が同設定画面にて、Grant admin consent for {テナント名}を選択し、アクセス許可を付与
- `.env` ファイルにクライアントID、シークレットID、テナントIDを設定
- 問い合わせメール送信API（Next.jsのルータ）を設置し、各IDを用いてAzure MSALミドルウェアを組み込む

## 認証情報の取り扱いについて
- Auth.jsライブラリを用いて、Email/Password及びGoogleをプロバイダーとして、認証機能を実装済み
- JWTの有効期限を1時間（maxAge: 60 * 60 * 1000）として設定済み（ブラウザをリロードすることで再度JWTが発行され、有効期限が更新される）

## reCaptcha v3の導入:  
- reCaptcha v3を参照
  [記事](https://zenn.dev/shomtsm/articles/4a3d46dce6268b)  

## Sitemap 設定
- sitemap.xmlを生成するための設定
  [記事1](https://www.npmjs.com/package/next-sitemap)  
  [記事2](https://chocolat5.com/tips/nextjs-sitemap-google-console/)  
- 設定後、Google Search Consoleにてsitemap.xmlを登録（URLプレフィックス方式・HTML埋め込みを採用）
