import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "../auth.config";

const ADMIN_ROLES = ["ADMIN", "EDITOR"] as const;

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);
  const userRole = req.auth?.user?.role;
  const isProtectedRoute = nextUrl.pathname.startsWith("/portal-admin");
  const isLoginPage = nextUrl.pathname.startsWith("/portal-login");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/portal-login", nextUrl));
  }

  if (
    isProtectedRoute &&
    isLoggedIn &&
    !ADMIN_ROLES.includes(userRole as (typeof ADMIN_ROLES)[number])
  ) {
    return NextResponse.redirect(new URL("/?error=unauthorized", nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/portal-admin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/portal-admin/:path*", "/portal-login"],
  runtime: "nodejs",
};
