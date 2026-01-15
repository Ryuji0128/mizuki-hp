import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";

export async function GET() {
  try {
    const prisma = await getPrismaClient();
    const news = await prisma.news.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ news });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrismaClient();
    const body = await req.json();
    const { date, title, contents, url } = body;

    if (!date || !title || !contents) {
      return NextResponse.json({ error: "date, title, and contents are required fields" }, { status: 400 });
    }

    const news = await prisma.news.create({
      data: {
        date: new Date(date),
        title,
        contents,
        url: url || null,
      },
    });

    return NextResponse.json({ message: "News added successfully", news });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to add news" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const prisma = await getPrismaClient();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.news.delete({ where: { id } });

    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const prisma = await getPrismaClient();
    const body = await req.json();
    const { id, date, title, contents, url } = body;

    if (!id || !title || !contents) {
      return NextResponse.json({ error: "id, title, and contents are required fields" }, { status: 400 });
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        date,
        title,
        contents,
        url,
      },
    });

    return NextResponse.json({ message: "News updated successfully", updatedNews });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}