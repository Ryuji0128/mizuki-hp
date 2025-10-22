// src/app/portal-admin/blog/api/upload/route.ts
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
        }

        // ファイルをバッファに変換
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 保存先ディレクトリ
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // ユニークなファイル名
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        // 保存
        await writeFile(filePath, buffer);
        console.log("✅ ファイル保存成功:", filePath);

        // URLを返す
        const imageUrl = `/uploads/${fileName}`;
        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        console.error("❌ アップロードエラー:", error);
        return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
    }
}
