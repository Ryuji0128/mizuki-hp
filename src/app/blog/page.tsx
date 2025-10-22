import Image from "next/image";
import Link from "next/link";

async function getBlogs() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blog`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("ブログ一覧の取得に失敗しました");
    return res.json();
}

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams; // ← ここでawait追加！
    const blogs = await getBlogs();

    // --- ページネーション設定 ---
    const currentPage = Number(params?.page) || 1;
    const perPage = 6;
    const totalPages = Math.ceil(blogs.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const currentBlogs = blogs.slice(startIndex, startIndex + perPage);

    // --- アーカイブグループ ---
    const archiveMap = blogs.reduce((acc: any, blog: any) => {
        const date = new Date(blog.createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const key = `${year}年${month}月`;
        acc[key] = acc[key] ? acc[key] + 1 : 1;
        return acc;
    }, {});
    const archives = Object.entries(archiveMap) as [string, number][]; // ←これを追加！
    return (
        <main className="max-w-7xl mx-auto px-6 py-16 bg-[#faf8f6] min-h-screen font-['Yuji_Syuku'] grid lg:grid-cols-[2fr_1fr] gap-10">
            {/* 左側：ブログ一覧 */}
            <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-14 text-center tracking-widest">
                    ✿ 院長俳句展 ✿
                </h1>

                <div className="grid gap-14 sm:grid-cols-2">
                    {currentBlogs.map((blog: any) => (
                        <div
                            key={blog.id}
                            className="block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ease-out"
                        >
                            {blog.imageUrl && (
                                <div className="relative w-full h-[300px] overflow-hidden">
                                    <Image
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        width={800}
                                        height={500}
                                        className="object-cover w-full h-full transition-transform duration-700 ease-in-out hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-6 space-y-4">
                                <h2 className="text-xl text-gray-800 font-semibold border-b pb-2">{blog.title}</h2>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {blog.content}
                                </p>
                                <div className="text-right pt-3 text-gray-400 text-sm">
                                    🗓 {new Date(blog.createdAt).toLocaleDateString("ja-JP")}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- ページネーション --- */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-10 gap-2 text-gray-700 font-['Yuji_Syuku']">
                        {currentPage > 1 && (
                            <Link
                                href={`/blog?page=${currentPage - 1}`}
                                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
                            >
                                ← 前へ
                            </Link>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={`/blog?page=${page}`}
                                className={`px-4 py-2 border rounded-md ${page === currentPage
                                    ? "bg-green-700 text-white border-green-700"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </Link>
                        ))}

                        {currentPage < totalPages && (
                            <Link
                                href={`/blog?page=${currentPage + 1}`}
                                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
                            >
                                次へ →
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* 右側：アーカイブ */}
            <aside className="bg-white border border-gray-200 rounded-xl p-4 h-fit shadow-sm">
                <h2 className="text-center bg-gray-200 rounded-md py-2 font-semibold text-gray-700 mb-4">
                    アーカイブ
                </h2>
                <ul className="space-y-1 text-sm">
                    {archives.map(([key, count]) => {
                        const match = key.match(/(\d+)年(\d+)月/);
                        const year = match?.[1];
                        const month = match?.[2];
                        return (
                            <li key={key}>
                                <Link
                                    href={`/blog/${year}/${month}`}
                                    className="text-gray-700 hover:text-green-700 transition"
                                >
                                    {key}（{count}）
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </aside>
        </main>
    );
}
