#!/bin/bash

domain="mizuki-clinic.online"
email=""  # ここにメールアドレスを設定
staging=0 # テスト時は1に設定（Let's Encryptのレート制限回避）

if [ -z "$email" ]; then
  echo "Error: init-letsencrypt.sh 内の email を設定してください"
  exit 1
fi

echo "### ディレクトリ作成 ###"
mkdir -p certbot/conf certbot/www

echo "### ダミー証明書を作成 ###"
mkdir -p certbot/conf/live/$domain
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$domain/privkey.pem \
    -out /etc/letsencrypt/live/$domain/fullchain.pem \
    -subj '/CN=localhost'" certbot

echo "### nginx起動 ###"
docker compose up -d nginx

echo "### ダミー証明書を削除 ###"
docker compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$domain && \
  rm -rf /etc/letsencrypt/archive/$domain && \
  rm -rf /etc/letsencrypt/renewal/$domain.conf" certbot

echo "### Let's Encrypt 証明書を取得 ###"
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    --email $email \
    -d $domain \
    --rsa-key-size 4096 \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

echo "### nginx再起動 ###"
docker compose restart nginx

echo "### 完了! https://$domain でアクセスできます ###"
