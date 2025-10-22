import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ブログ投稿 API
export async function POST(req: Request) {
    try {
        const { title, content, imageUrl } = await req.json();

        if (!title || !content) {
            return NextResponse.json(
                { error: "タイトルと本文は必須です" },
                { status: 400 }
            );
        }

        const newBlog = await prisma.blog.create({
            data: {
                title,
                content,
                imageUrl: imageUrl || null,
            },
        });

        return NextResponse.json({ success: true, blog: newBlog });
    } catch (error) {
        console.error("ブログ投稿エラー:", error);
        return NextResponse.json(
            { success: false, error: "サーバーエラーが発生しました" },
            { status: 500 }
        );
    }
}

// ブログ一覧取得 API（一覧表示用）
export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(blogs);
    } catch (error) {
        console.error("ブログ一覧取得エラー:", error);
        return NextResponse.json(
            { success: false, error: "取得に失敗しました" },
            { status: 500 }
        );
    }
}
