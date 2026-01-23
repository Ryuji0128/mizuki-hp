"use server";

import { signIn } from "@/auth";
import { getPrismaClient } from "@/lib/db";
import * as z from "zod";
import { LoginSchema } from "@/lib/validation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validateData = LoginSchema.safeParse(data);

  if (!validateData.success) {
    return { success: false, messages: ["入力内容に不備があります。"] };
  }

  const { email, password } = validateData.data;

  const prisma = getPrismaClient();
  const existUser = await prisma.user.findUnique({
    where: { email },
    select: { email: true, password: true },
  });

  if (!existUser || !existUser.email) {
    return { success: false, messages: ["ユーザーが存在しません。"] };
  }

  if (!existUser.password) {
    return { success: false, messages: ["このアカウントはパスワードログインに対応していません。"] };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      // next-auth が成功時に throw する NEXT_REDIRECT は再 throw して正常に処理させる
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, messages: ["パスワードが間違っています。"] };
        default:
          return { success: false, messages: ["ログインに失敗しました。"] };
      }
    }
    return { success: false, messages: ["サーバーエラーが発生しました。管理者へ問い合わせてください。"] };
  }

  return { success: true };
};
