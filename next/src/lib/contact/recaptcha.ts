import { fetchSecret } from "@/lib/fetchSecrets";

export async function verifyContactRecaptcha(token: string): Promise<boolean> {
  // 開発環境のみバイパス可能（本番環境では無視）
  if (process.env.NODE_ENV !== "production" && process.env.RECAPTCHA_BYPASS === "true") {
    return true;
  }
  if (process.env.NODE_ENV === "development") return true;
  if (!token) return false;

  const secret = await fetchSecret("RECAPTCHA_SECRET_KEY");
  if (!secret) return false;

  const body = new URLSearchParams();
  body.append("secret", secret);
  body.append("response", token);

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) return false;

  const data = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
  };

  return Boolean(data.success) && Number(data.score ?? 0) >= 0.5 && data.action === "contact";
}
