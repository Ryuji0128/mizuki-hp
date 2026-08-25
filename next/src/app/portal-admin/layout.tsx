import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const STAFF_ROLES = ["ADMIN", "EDITOR"] as const;

export default async function PortalAdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/portal-login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || !STAFF_ROLES.includes(user.role as (typeof STAFF_ROLES)[number])) {
    redirect("/?error=unauthorized");
  }

  return children;
}
