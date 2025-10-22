import { writeFile } from "fs/promises";
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

        // 保存先のパス
        const filePath = path.join(process.cwd(), "public/uploads", file.name);

        // 保存処理
        await writeFile(filePath, buffer);

        console.log("✅ ファイル保存成功:", filePath);

        // クライアントへ返すURL
        const fileUrl = `/uploads/${file.name}`;
        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error("❌ 画像アップロードエラー:", error);
        return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
    }
}
