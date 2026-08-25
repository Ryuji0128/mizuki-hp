"use server";

import { signIn } from "@/auth";
import { checkRateLimitKey, getTrustedClientIp } from "@/lib/rateLimit";
import { LoginSchema } from "@/lib/validation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import * as z from "zod";

const AUTH_ERROR_MESSAGE = "メールアドレスまたはパスワードが正しくありません。";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const headersList = await headers();
  const clientIp = getTrustedClientIp(headersList);
  const rateLimit = await checkRateLimitKey(`login:${clientIp}`, {
    max: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (rateLimit.limited) {
    return {
      success: false,
      messages: ["ログイン試行回数の上限に達しました。15分後に再度お試しください。"],
    };
  }

  const validateData = LoginSchema.safeParse(data);
  if (!validateData.success) {
    return { success: false, messages: ["入力内容に不備があります。"] };
  }

  const { email, password } = validateData.data;

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof AuthError) {
      return { success: false, messages: [AUTH_ERROR_MESSAGE] };
    }
    return {
      success: false,
      messages: ["サーバーエラーが発生しました。管理者へお問い合わせください。"],
    };
  }

  return { success: true };
};
