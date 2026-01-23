import { auth } from "@/auth";
import { getPrismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: [{ pinned: "desc" }, { date: "desc" }],
    });
    return NextResponse.json({ news });
  } catch (error) {
    console.error("お知らせ取得エラー:", error);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未ログインです" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { date, title, contents, url, color, pinned } = body;

    if (!date || !title || !contents) {
      return NextResponse.json(
        { error: "日付、タイトル、内容は必須です" },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        date: new Date(date),
        title,
        contents,
        url: url || null,
        color: color || "black",
        pinned: pinned || false,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("お知らせ作成エラー:", error);
    return NextResponse.json({ error: "作成に失敗しました" }, { status: 500 });
  }
}
