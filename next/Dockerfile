# ===== 依存関係インストールステージ =====
FROM node:22.23.2-alpine3.24 AS deps
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# 依存関係ファイルのみコピー（キャッシュ効率化）
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000

# ===== ビルドステージ =====
FROM node:22.23.2-alpine3.24 AS builder
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=2048"

# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock ./

# Prisma スキーマをコピーして generate
COPY prisma ./prisma
RUN npx prisma generate

# ソースコードをコピーしてビルド
COPY . .

# 環境変数を設定（ビルド時にテレメトリを無効化）
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

# ===== 本番ステージ（軽量）=====
FROM node:22.23.2-alpine3.24 AS runner
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# セキュリティ: 非rootユーザーで実行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# standalone出力をコピー（publicはnextjsユーザーに書き込み権限付与）
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# アップロードディレクトリの作成と権限設定
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
