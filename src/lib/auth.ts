import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrismaClient } from "@/lib/db";
import authConfig from "../../auth.config";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(await getPrismaClient()),
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 1000,
  },
  ...authConfig,
  callbacks: {
    // async session({ session, user }) {
    //   const dbUser = await getUserByEmail(session.user.email); // DBからユーザー情報取得
    //   session.user.id = dbUser.id;
    //   session.user.role = dbUser.role; // roleをsession.userに追加
    //   return session;
    // },
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = user.role; // JWTにもroleを含める
    //   }
    //   return token;
    // },
  },
});
