"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBlogPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 📸 プレビュー表示
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let imageUrl = null;

            // ✅ 画像が選択されていたらアップロード
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);

                const uploadRes = await fetch("/portal-admin/blog/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error("画像のアップロードに失敗しました");
                }

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url; // ← アップロード先URLを受け取る
            }

            // ✅ 本文データを送信
            const res = await fetch("/portal-admin/blog/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, imageUrl }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "投稿に失敗しました");
            }

            router.push("/portal-admin/blog");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">📝 新規ブログ投稿</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 bg-white p-6 rounded-2xl shadow-md"
            >
                {error && (
                    <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                        {error}
                    </p>
                )}

                {/* タイトル */}
                <input
                    type="text"
                    placeholder="タイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-3 rounded-md"
                    required
                />

                {/* 本文 */}
                <textarea
                    placeholder="本文"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border p-3 rounded-md min-h-[150px]"
                    required
                />

                {/* 画像アップロード */}
                <div>
                    <label className="block text-gray-700 mb-2 font-semibold">
                        📸 サムネイル画像
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded-md"
                    />
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="プレビュー"
                            className="mt-4 rounded-lg shadow-md max-h-60 object-cover"
                        />
                    )}
                </div>

                {/* 投稿ボタン */}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                    {loading ? "投稿中..." : "投稿する"}
                </button>
            </form>
        </main>
    );
}
