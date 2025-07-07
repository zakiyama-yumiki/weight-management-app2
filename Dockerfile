# ベースイメージ
FROM node:20-alpine AS base

# 依存関係インストール用ステージ
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# package.jsonとpackage-lock.json（存在する場合）をコピー
COPY package*.json ./
RUN npm ci

# ビルド用ステージ
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.jsアプリケーションをビルド
RUN npm run build

# 本番用ステージ
FROM base AS runner
WORKDIR /app

# 非rootユーザーで実行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なファイルのみコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

# 開発用ステージ
FROM base AS dev
WORKDIR /app

# 開発に必要なパッケージをインストール
RUN apk add --no-cache git

# Vercel CLIをグローバルにインストール
RUN npm install -g vercel@latest

# package.jsonとpackage-lock.json（存在する場合）をコピー
COPY package*.json ./
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# 開発サーバーを起動
EXPOSE 3000
CMD ["npm", "run", "dev"]