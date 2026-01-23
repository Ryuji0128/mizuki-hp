"use client";

import { useEffect, useState, useCallback } from "react";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  inquiry: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

export default function InquiryListPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/email");
      if (!res.ok) throw new Error("取得に失敗しました");
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error("取得エラー:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleDelete = async (id: number) => {
    if (!confirm("このお問い合わせを削除しますか？")) return;

    try {
      const res = await fetch("/api/email", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        alert("削除に失敗しました");
        return;
      }
      alert("削除しました");
      fetchInquiries();
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除中にエラーが発生しました");
    }
  };

  const totalPages = Math.ceil(inquiries.length / ITEMS_PER_PAGE);
  const paginatedInquiries = inquiries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📩 お問い合わせ一覧
      </h1>

      {inquiries.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">お問い合わせはありません。</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-3">日時</th>
                  <th className="text-left p-3">名前</th>
                  <th className="text-left p-3">メール</th>
                  <th className="text-left p-3">電話</th>
                  <th className="text-left p-3">内容</th>
                  <th className="text-center p-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((inq) => (
                  <tr key={inq.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="p-3">{inq.name}</td>
                    <td className="p-3 text-blue-600">{inq.email}</td>
                    <td className="p-3">{inq.phone || "-"}</td>
                    <td className="p-3 max-w-[200px] truncate">{inq.inquiry}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        詳細
                      </button>
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="text-red-600 hover:underline"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                前へ
              </button>
              <span className="px-3 py-1">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}

      {/* 詳細モーダル */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">お問い合わせ詳細</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-600">日時:</span>
                <p>{new Date(selectedInquiry.createdAt).toLocaleString("ja-JP")}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">名前:</span>
                <p>{selectedInquiry.name}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">メール:</span>
                <p>{selectedInquiry.email}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">電話:</span>
                <p>{selectedInquiry.phone || "-"}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">お問い合わせ内容:</span>
                <p className="whitespace-pre-wrap mt-1">{selectedInquiry.inquiry}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedInquiry(null)}
              className="mt-6 w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
