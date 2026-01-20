FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["yarn", "dev", "-H", "0.0.0.0", "-p", "3000"]
