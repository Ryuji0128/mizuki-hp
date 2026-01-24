import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// 古いエントリを定期的にクリーンアップ
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60_000);

interface RateLimitOptions {
  windowMs?: number; // ウィンドウ期間（ミリ秒）
  max?: number; // ウィンドウ内の最大リクエスト数
}

/**
 * IPベースのレート制限チェック
 * @returns true = 制限超過, false = OK
 */
export function isRateLimited(
  req: NextRequest,
  options: RateLimitOptions = {}
): boolean {
  const { windowMs = 60_000, max = 5 } = options;

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${req.nextUrl.pathname}`;

  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  entry.count++;
  if (entry.count > max) {
    return true;
  }

  return false;
}
