import { getPrismaClient } from "@/lib/db";
import { fetchSecrets } from "@/lib/fetchSecrets";
import bcryptjs from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authOptions = async () => {
  const secrets = await fetchSecrets([
    "AUTH_SECRET",
    "AUTH_GOOGLE_ID",
    "AUTH_GOOGLE_SECRET",
    "AUTH_URL",
  ]);
  process.env.AUTH_SECRET = secrets.AUTH_SECRET;
  process.env.AUTH_GOOGLE_ID = secrets.AUTH_GOOGLE_ID;
  process.env.AUTH_GOOGLE_SECRET = secrets.AUTH_GOOGLE_SECRET;
  process.env.AUTH_URL = secrets.AUTH_URL;
  return {
    pages: {
      signIn: "/portal-login",
    },
    providers: [
      Google({
        name: "Google of Fusetsu.co",
      }),
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          // ユーザー認証時に入力された値のチェック
          if (!credentials.email || !credentials.password) {
            throw new Error("メールアドレス若しくはパスワードが入力されていません。");
          }
          // Todo: zodのバリデーションを使う場合（クライアントと同じスキーマになるが、Serverでも対応する場合はアクティブにする）
          // そもそも、ログイン時にはバリデーションエラーは必要ないということであれば削除。

          // const validateData = LoginSchema.safeParse(credentials);
          // if (!validateData.success) {
          //     const errors = validateData.error.flatten();
          //     const errorMessages: string[] = [];
          //     for (const key in errors.fieldErrors) {
          //         const fieldError = errors.fieldErrors[key as keyof typeof errors.fieldErrors];
          //         if (fieldError) {
          //             errorMessages.push(...fieldError);
          //         }
          //     }
          //     return errorMessages.join("、") + "。";
          // }

          const prisma = await getPrismaClient();

          // ユーザーが存在するか確認
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });

          // ユーザーが存在しない場合
          if (!user) {
            throw new Error("ユーザーが存在しません。");
          }

          // パスワードが一致するか確認
          const passwordMatch = await bcryptjs.compare(
            credentials.password as string,
            user.password as string
          );

          // パスワードが一致しない場合
          if (!passwordMatch) {
            throw new Error("パスワードが間違っています。");
          }
          return user;
        },
      }),
    ],
    theme: {
      logo: "/seta_logo_transparent.png",
      buttonText: "Googleでログイン",
    },
  };
};

const authOption = await authOptions();

export default authOption satisfies NextAuthConfig;
