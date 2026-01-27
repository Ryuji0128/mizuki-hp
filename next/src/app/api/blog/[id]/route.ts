import { auth } from "@/auth";
import { getPrismaClient } from "@/lib/db";
import xss from "xss";
import { NextResponse } from "next/server";

const prisma = getPrismaClient();

// =====================
// 単一記事取得 API
// =====================
export async function GET(request: Request, context: any) {
    const id = context?.params?.id;
    const session = await auth();

    if (!id) {
        return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
    }

    if (!session) {
        return NextResponse.json({ error: "未ログインです" }, { status: 401 });
    }

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) },
        });

        if (!blog) {
            return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error("取得エラー:", error);
        return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
    }
}

// =====================
// 削除 API
// =====================
export async function DELETE(request: Request, context: any) {
    const { id } = await context.params;
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

    try {
        await prisma.blog.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: "削除しました" });
    } catch (error) {
        console.error("削除エラー:", error);
        return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
    }
}

// =====================
// 編集 API
// =====================
export async function PUT(request: Request, context: any) {
    const id = context?.params?.id;
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

    try {
        const updated = await prisma.blog.update({
            where: { id: Number(id) },
            data: {
                title: title ? xss(title) : undefined,
                content,
                imageUrl: imageUrl !== undefined ? imageUrl : undefined,
                imagePosition: imagePosition || undefined,
            },
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("更新エラー:", error);
        return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
    }
}
