"use client";
import Link from "next/link";

interface Props {
    currentPage: number;
    totalPages: number;
    basePath: string; // 例: "/blog" または `/blog/2025/10`
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center mt-10 gap-2 text-gray-700 font-['Yuji_Syuku']">
            {/* 前へ */}
            {currentPage > 1 && (
                <Link
                    href={`${basePath}?page=${currentPage - 1}`}
                    className="px-3 py-1 border rounded hover:bg-gray-100 transition"
                >
                    ← 前へ
                </Link>
            )}

            {/* ページ番号 */}
            {pages.map((page) => (
                <Link
                    key={page}
                    href={`${basePath}?page=${page}`}
                    className={`px-3 py-1 border rounded ${page === currentPage
                            ? "bg-green-700 text-white border-green-700"
                            : "hover:bg-gray-100"
                        }`}
                >
                    {page}
                </Link>
            ))}

            {/* 次へ */}
            {currentPage < totalPages && (
                <Link
                    href={`${basePath}?page=${currentPage + 1}`}
                    className="px-3 py-1 border rounded hover:bg-gray-100 transition"
                >
                    次へ →
                </Link>
            )}
        </div>
    );
}
