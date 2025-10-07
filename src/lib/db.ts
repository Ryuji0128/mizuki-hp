import { PrismaClient } from "@prisma/client";
import { fetchSecrets } from "@/lib/fetchSecrets";

// 型定義: グローバルオブジェクト
// type GlobalPrisma = { prisma?: PrismaClient };
// const globalForPrisma = global as unknown as GlobalPrisma;
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// シークレット名の定義
const secretNames = [
  "SQL_USERNAME",
  "SQL_PASSWORD",
  "SQL_DATABASE",
  "SQL_CONNECTIONNAME", // GAE用の接続名取得
];

/**
 * 環境に応じてPrismaクライアントを初期化する
 * - ローカル環境: host と port を使用
 * - GAE環境: UNIXソケットを使用
 */
export async function getPrismaClient(): Promise<PrismaClient> {
  if (!globalForPrisma.prisma) {
    try {
      // シークレットの取得
      const secrets = await fetchSecrets(secretNames);

      // 開発環境判定
      let isLocal = false;
      if (process.env.ENVIRONMENT === "development") {
        if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
          isLocal = true;
        }
      }

      const { SQL_USERNAME: USERNAME, SQL_PASSWORD: PASSWORD, SQL_DATABASE: DATABASE, SQL_CONNECTIONNAME: CONNECTIONNAME } = secrets;

      const { SQL_HOST: HOST = "127.0.0.1", SQL_PORT: PORT = 3306 } = process.env;

      // 環境に応じた接続URLの作成
      const connectionUrl = isLocal 
       ? `mysql://${USERNAME}:${PASSWORD}@${HOST}:${Number(PORT)}/${DATABASE}` 
       : `mysql://${USERNAME}:${PASSWORD}@localhost/${DATABASE}?socket=/cloudsql/${CONNECTIONNAME}`;

      // Prisma クライアントをグローバル化（シングルトンパターン）
      globalForPrisma.prisma = new PrismaClient({
        datasources: {
          db: {
            url: connectionUrl,
          },
        },
      });

    } catch (error) {
      console.error("Prismaクライアントの初期化エラー:", error);
      throw error;
    } 
  }
  return globalForPrisma.prisma as PrismaClient;
}
