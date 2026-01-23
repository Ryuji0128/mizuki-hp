import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = nextUrl.pathname.startsWith("/portal-admin");
  const isLoginPage = nextUrl.pathname.startsWith("/portal-login");

  // 未ログインで保護ルートにアクセスした場合 → ログインページへ
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/portal-login", nextUrl));
  }

  // ログイン済みでログインページにアクセスした場合 → 管理画面へ
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/portal-admin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/portal-admin/:path*", "/portal-login"],
};
