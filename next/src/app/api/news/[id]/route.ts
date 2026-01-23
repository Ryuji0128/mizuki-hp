import { auth } from "@/auth";
import { getPrismaClient } from "@/lib/db";
import { NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const news = await prisma.news.findUnique({
      where: { id: Number(id) },
    });

    if (!news) {
      return NextResponse.json({ error: "お知らせが見つかりません" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("取得エラー:", error);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "未ログインです" }, { status: 401 });
  }

  const data = await request.json();

  try {
    const updated = await prisma.news.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        date: new Date(data.date),
        contents: data.contents,
        url: data.url || null,
        color: data.color || "black",
        pinned: data.pinned || false,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("更新エラー:", error);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "未ログインです" }, { status: 401 });
  }

  try {
    await prisma.news.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    console.error("削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
