"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBlogPage() {
    const { id } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            const res = await fetch(`/portal-admin/blog/api/${id}`);
            const data = await res.json();
            setBlog(data);
            setTitle(data.title);
            setContent(data.content);
            setImageUrl(data.imageUrl || null); // ← 追加
        };
        fetchBlog();
    }, [id]);

    // 🖼️ 画像アップロード処理
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/portal-admin/blog/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            setImageUrl(data.url);
        } else {
            alert("画像アップロードに失敗しました");
        }

        setUploading(false);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/portal-admin/blog/api/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, imageUrl }), // ← imageUrlを追加
        });
        if (res.ok) router.push("/portal-admin/blog");
        else alert("更新に失敗しました");
    };

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">✏️ ブログ編集</h1>

            {blog ? (
                <form onSubmit={handleUpdate} className="space-y-5 bg-white p-6 rounded-2xl shadow-md">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border p-3 rounded-md"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border p-3 rounded-md min-h-[150px]"
                    />

                    {/* 🖼️ ここを追加：画像アップロード */}
                    <div>
                        <label className="font-semibold block mb-2">📸 サムネイル画像</label>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="現在の画像"
                                className="w-48 h-32 object-cover rounded-md border mb-3"
                            />
                        )}
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                        {uploading && <p className="text-sm text-gray-500 mt-1">アップロード中...</p>}
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
                    >
                        更新する
                    </button>
                </form>
            ) : (
                <p>読み込み中...</p>
            )}
        </main>
    );
}
