import { auth } from "@/auth";
import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "ファイルサイズは5MB以下にしてください" }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "許可されていないファイル形式です（JPEG, PNG, GIF, WebPのみ）" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const ext = path.extname(file.name).toLowerCase();
        const safeName = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
        const filePath = path.join(uploadDir, safeName);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${safeName}`;
        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        console.error("アップロードエラー:", error);
        return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
    }
}
