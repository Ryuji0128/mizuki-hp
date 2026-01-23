"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type News = {
  id: number;
  title: string;
  date: string;
  url: string | null;
  createdAt: string;
};

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("取得に失敗しました");
      const data = await res.json();
      setNewsList(data.news || []);
    } catch (err) {
      console.error("取得エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("このお知らせを削除しますか？")) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("削除に失敗しました");
        return;
      }
      alert("削除しました");
      fetchNews();
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除中にエラーが発生しました");
    }
  };

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">📢 お知らせ一覧</h1>
        <Link
          href="/portal-admin/news/new"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          ＋ 新規作成
        </Link>
      </div>

      {newsList.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">お知らせはありません。</p>
      ) : (
        newsList.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-xl shadow-sm border p-4 flex justify-between items-start"
          >
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{news.title}</h2>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span>📅 {new Date(news.date).toLocaleDateString("ja-JP")}</span>
                {news.url && (
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    リンク
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-4 text-sm ml-4">
              <Link
                href={`/portal-admin/news/edit/${news.id}`}
                className="text-blue-600 hover:underline"
              >
                編集
              </Link>
              <button
                onClick={() => handleDelete(news.id)}
                className="text-red-600 hover:underline"
              >
                削除
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
