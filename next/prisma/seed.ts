import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrator";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required");
  }

  if (password.length < 12 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 12 characters and include upper-case, lower-case, and numeric characters"
    );
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      name,
    },
    create: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      name,
    },
  });

  console.log(`管理者アカウントを作成しました: ${user.email} (ID: ${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
