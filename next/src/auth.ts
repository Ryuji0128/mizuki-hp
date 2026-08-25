import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "../auth.config";

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
const DUMMY_PASSWORD_HASH = "$2b$10$89gj1HTei3jdVvz8.e6sJOh36n9gwxmKJublLj6h.IxuDgzXXPpIe";
const AUTH_ERROR_MESSAGE = "メールアドレスまたはパスワードが正しくありません。";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  jwt: { maxAge: 60 * 60 },
  trustHost: true,
  useSecureCookies,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "メールアドレス", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) throw new Error(AUTH_ERROR_MESSAGE);

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, password: true, role: true },
        });
        if (!user) {
          await bcryptjs.compare(password, DUMMY_PASSWORD_HASH);
          throw new Error(AUTH_ERROR_MESSAGE);
        }

        const passwordMatch = await bcryptjs.compare(password, String(user.password || ""));
        if (!passwordMatch) throw new Error(AUTH_ERROR_MESSAGE);

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
