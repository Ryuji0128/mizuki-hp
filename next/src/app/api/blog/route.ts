import { auth } from "@/auth";
import { getPrismaClient } from "@/lib/db";
import xss from "xss";
import { NextResponse } from "next/server";

const prisma = getPrismaClient();

// =====================
// 一覧取得 (GET)
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
// 投稿作成 (POST)
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

    const body = await request.json();
    const { title, content, imageUrl, imagePosition } = body;

    if (!title || !content) {
        return NextResponse.json({ error: "タイトルと本文は必須です" }, { status: 400 });
    }

    try {
        const newBlog = await prisma.blog.create({
            data: {
                title: xss(title),
                content,
                imageUrl: imageUrl || null,
                imagePosition: imagePosition || "center",
            },
        });
        return NextResponse.json(newBlog);
    } catch (error) {
        console.error("作成エラー:", error);
        return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
    }
}
