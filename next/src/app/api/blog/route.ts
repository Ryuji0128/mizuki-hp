import { auth } from "@/auth";
import { getPrismaClient } from "@/lib/db";
import { NextResponse } from "next/server";

const prisma = getPrismaClient();

// =====================
// 🟢 一覧取得 (GET)
// =====================
export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(blogs);
    } catch (error) {
        console.error("GETエラー:", error);
        return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
    }
}

// =====================
// 🟡 投稿作成 (POST)
// =====================
export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "未ログインです" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const data = await request.json();

    try {
        const newBlog = await prisma.blog.create({ data });
        return NextResponse.json(newBlog);
    } catch (error) {
        console.error("作成エラー:", error);
        return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
    }
}
