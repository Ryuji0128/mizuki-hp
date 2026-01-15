FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# 基本ツール
RUN apt update && apt install -y \
    curl \
    ca-certificates \
    gnupg \
    build-essential \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Node.js 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt install -y nodejs

# Yarn
RUN npm install -g yarn

WORKDIR /app

# 依存関係だけ先にコピー（キャッシュ効率UP）
COPY package.json yarn.lock ./
RUN yarn install

# 残りをコピー
COPY . .

EXPOSE 3000

CMD ["yarn", "dev", "-H", "0.0.0.0", "-p", "3000"]
