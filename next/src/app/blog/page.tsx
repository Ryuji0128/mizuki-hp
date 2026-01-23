import Image from "next/image";
import Link from "next/link";

async function getBlogs() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`,
        {
          cache: "no-store",
        }
      );
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
        <main className="min-h-screen font-['Yuji_Syuku']" style={{ background: "linear-gradient(180deg, #f7f3eb 0%, #ede8df 100%)" }}>
            {/* ヘッダー装飾 */}
            <div className="text-center pt-16 pb-10">
                <p className="text-sm text-gray-500 tracking-[0.5em] mb-2">── 季節のことば ──</p>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-[0.3em]">
                    院長俳句展
                </h1>
                <div className="mt-4 flex justify-center items-center gap-3">
                    <span className="block w-16 h-px bg-gray-400"></span>
                    <span className="text-gray-400 text-lg">✿</span>
                    <span className="block w-16 h-px bg-gray-400"></span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-16 grid lg:grid-cols-[1fr_240px] gap-10">
                {/* 俳句カード一覧 */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {currentBlogs.map((blog: any) => (
                        <div
                            key={blog.id}
                            className="group relative overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-all duration-500"
                            style={{ background: "linear-gradient(180deg, #fffef9 0%, #f5f0e6 100%)" }}
                        >
                            {/* 短冊風の上ライン */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-700 via-green-600 to-green-800"></div>

                            {blog.imageUrl && (
                                <div className="relative w-full aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover"
                                        style={{ objectPosition: blog.imagePosition || "center" }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                            )}

                            {/* 縦書きエリア */}
                            <div className="flex flex-col items-center py-6 px-3">
                                <div className="flex gap-4 h-[220px]">
                                    {/* 左：本文（縦書き・太字） */}
                                    {blog.content && (
                                        <p
                                            className="text-base text-gray-800 font-bold leading-relaxed"
                                            style={{ writingMode: "vertical-rl" }}
                                        >
                                            {blog.content}
                                        </p>
                                    )}

                                    {/* 右：タイトル（縦書き・通常） */}
                                    <h2
                                        className="text-lg text-gray-600 font-normal leading-relaxed"
                                        style={{ writingMode: "vertical-rl" }}
                                    >
                                        {blog.title}
                                    </h2>
                                </div>

                                {/* 日付（横書き） */}
                                <div className="mt-3 text-xs text-gray-400">
                                    {new Date(blog.createdAt).toLocaleDateString("ja-JP")}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 右側：アーカイブ */}
                <aside className="h-fit sticky top-6">
                    <div className="rounded-sm p-5 shadow-sm border border-gray-200" style={{ background: "#fffef9" }}>
                        <h2 className="text-center text-sm font-semibold text-gray-600 tracking-[0.3em] mb-4 pb-2 border-b border-gray-200">
                            句 集
                        </h2>
                        <ul className="space-y-2 text-sm">
                            {archives.map(([key, count]) => {
                                const match = key.match(/(\d+)年(\d+)月/);
                                const year = match?.[1];
                                const month = match?.[2];
                                return (
                                    <li key={key}>
                                        <Link
                                            href={`/blog/${year}/${month}`}
                                            className="flex justify-between items-center text-gray-600 hover:text-green-800 transition py-1 px-2 rounded hover:bg-green-50"
                                        >
                                            <span className="tracking-wider">{key}</span>
                                            <span className="text-xs text-gray-400">({count}句)</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </aside>
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center pb-16 gap-2 text-gray-700 font-['Yuji_Syuku']">
                    {currentPage > 1 && (
                        <Link
                            href={`/blog?page=${currentPage - 1}`}
                            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-white transition"
                        >
                            前へ
                        </Link>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Link
                            key={page}
                            href={`/blog?page=${page}`}
                            className={`px-4 py-2 text-sm border rounded ${page === currentPage
                                ? "bg-green-800 text-white border-green-800"
                                : "border-gray-300 hover:bg-white"
                                }`}
                        >
                            {page}
                        </Link>
                    ))}

                    {currentPage < totalPages && (
                        <Link
                            href={`/blog?page=${currentPage + 1}`}
                            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-white transition"
                        >
                            次へ
                        </Link>
                    )}
                </div>
            )}
        </main>
    );
}
