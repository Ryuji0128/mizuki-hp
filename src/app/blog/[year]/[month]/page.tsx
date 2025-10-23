import Image from "next/image";
import Link from "next/link";

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blog`, {
    // cache: "no-store",
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("ブログ一覧の取得に失敗しました");
  return res.json();
}

export default async function BlogMonthPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; month: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = searchParams ? await searchParams : {};

  const year = resolvedParams.year;
  const month = resolvedParams.month;
  const page = Number(resolvedSearch.page) || 1;

  const blogs = await getBlogs();

  // --- 月で絞り込み ---
  const filtered = blogs.filter((blog: any) => {
    const date = new Date(blog.createdAt);
    return (
      date.getFullYear().toString() === year &&
      String(date.getMonth() + 1).padStart(2, "0") === month
    );
  });

  // --- ページネーション設定 ---
  const perPage = 6;
  const totalPages = Math.ceil(filtered.length / perPage);
  const startIndex = (page - 1) * perPage;
  const currentBlogs = filtered.slice(startIndex, startIndex + perPage);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 bg-[#faf8f6] min-h-screen font-['Yuji_Syuku']">
      <h1 className="text-3xl font-bold text-gray-800 mb-12 text-center">
        🗓 {year}年{month}月の投稿
      </h1>

      {currentBlogs.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 text-lg">
          この月の投稿はありません。
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2">
          {currentBlogs.map((blog: any) => (
            <div key={blog.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
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
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {blog.content}
                </p>
                <p className="text-right text-gray-400 text-sm">
                  🗓 {new Date(blog.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2 text-gray-700 font-['Yuji_Syuku']">
          {page > 1 && (
            <Link
              href={`/blog/${year}/${month}?page=${page - 1}`}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
            >
              ← 前へ
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/blog/${year}/${month}?page=${p}`}
              className={`px-4 py-2 border rounded-md ${p === page ? "bg-green-700 text-white border-green-700" : "hover:bg-gray-100"
                }`}
            >
              {p}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={`/blog/${year}/${month}?page=${page + 1}`}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
            >
              次へ →
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
