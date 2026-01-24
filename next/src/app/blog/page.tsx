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

// 旧サイト（mizuki-clinic.jp）の俳句データ（2024/01〜）
const oldHaikuData = [
    { title: "初景色", content: "初景色\n中吉ひとつ\n旅へ足す", date: "2026-01-07", imageUrl: "https://static.wixstatic.com/media/bc6929_6e2fc4469556465ebe036f2b700edb68~mv2.jpeg/v1/fill/w_576,h_768,al_c,lg_1,q_85/bc6929_6e2fc4469556465ebe036f2b700edb68~mv2.jpeg" },
    { title: "冬の虹", content: "車窓より\n冬の虹ふと\n退路なし", date: "2025-12-25", imageUrl: "https://static.wixstatic.com/media/bc6929_21e73827e4ac4f0b8fe8818f5f8f9cbf~mv2.jpg/v1/fill/w_880,h_1000,al_c,q_85,usm_0.66_1.00_0.01/bc6929_21e73827e4ac4f0b8fe8818f5f8f9cbf~mv2.jpg" },
    { title: "お盆", content: "お盆とは\nソース飛び散る\nスパゲッティ", date: "2025-08-16", imageUrl: "https://static.wixstatic.com/media/bc6929_bac7d933f59d426f93742ab02d21bcb0~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/bc6929_bac7d933f59d426f93742ab02d21bcb0~mv2.jpg" },
    { title: "夏の海", content: "ひととせの\n距離を漕ぎゆく\n夏の海", date: "2025-08-04", imageUrl: "https://static.wixstatic.com/media/bc6929_754ef0bd15f54f7cb84cae38cb9d8bd8~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,usm_0.66_1.00_0.01/bc6929_754ef0bd15f54f7cb84cae38cb9d8bd8~mv2.jpg" },
    { title: "鰻", content: "土用（曜）午後\n鰻屋だけが\n活気づく", date: "2025-07-19", imageUrl: "https://static.wixstatic.com/media/bc6929_f7a82a919d7d4fe08a65251f60a2851a~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/bc6929_f7a82a919d7d4fe08a65251f60a2851a~mv2.jpg" },
    { title: "蝸牛", content: "透明な\n吾を見つける\n蝸牛", date: "2025-07-09", imageUrl: "https://static.wixstatic.com/media/bc6929_4795935b22d74de5aad796a3cd157192~mv2.jpg/v1/fill/w_635,h_640,al_c,q_85/bc6929_4795935b22d74de5aad796a3cd157192~mv2.jpg" },
    { title: "青鷺", content: "青鷺や\nまるで世のこと\n他人ごと", date: "2025-06-25", imageUrl: "https://static.wixstatic.com/media/bc6929_5208b8469d4a48e7b5862d797ca09709~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/bc6929_5208b8469d4a48e7b5862d797ca09709~mv2.jpg" },
    { title: "紫陽花", content: "紫陽花や\n嘘などつかぬ\n顔をして", date: "2025-06-18", imageUrl: "https://static.wixstatic.com/media/bc6929_2a556f0e669a452f8db7ec5350c2abd3~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/bc6929_2a556f0e669a452f8db7ec5350c2abd3~mv2.jpg" },
    { title: "蜘蛛の巣", content: "蜘蛛の巣や\nゆりかごめきて\n墓に似て", date: "2025-06-11", imageUrl: "https://static.wixstatic.com/media/bc6929_45feca48ec294765ba94bb04a84268b8~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/bc6929_45feca48ec294765ba94bb04a84268b8~mv2.jpg" },
    { title: "筍（たけのこ）", content: "裏年と\n言われ筍\nむきになり", date: "2025-05-09", imageUrl: "https://static.wixstatic.com/media/bc6929_9f938ff162f64730bb665252f2643371~mv2.jpg/v1/fill/w_1000,h_866,al_c,q_85,usm_0.66_1.00_0.01/bc6929_9f938ff162f64730bb665252f2643371~mv2.jpg" },
    { title: "土筆（つくし）", content: "身の丈を\n自分で決める\nつくしんぼ", date: "2025-04-23", imageUrl: "https://static.wixstatic.com/media/bc6929_98bf73391cbd46169d78b1c594bf1381~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/bc6929_98bf73391cbd46169d78b1c594bf1381~mv2.jpg" },
    { title: "夜桜", content: "夜桜や\n人の数だけ\n花が散り", date: "2025-04-05", imageUrl: "https://static.wixstatic.com/media/bc6929_3afe09087c8d4c2cb41f50e002ec468c~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,usm_0.66_1.00_0.01/bc6929_3afe09087c8d4c2cb41f50e002ec468c~mv2.jpg" },
    { title: "春塵", content: "春塵や\nガザ・ウクライナ\nまつとおね", date: "2025-03-20", imageUrl: "https://static.wixstatic.com/media/bc6929_d56afa83eeed4e3a846b047341ebae19~mv2.jpg/v1/fill/w_1000,h_708,al_c,q_85,usm_0.66_1.00_0.01/bc6929_d56afa83eeed4e3a846b047341ebae19~mv2.jpg" },
    { title: "冬の虹", content: "冬の虹\n復興兆す\n放物線", date: "2025-01-02", imageUrl: "https://static.wixstatic.com/media/bc6929_08ed15cc8bf6404c845f05abd5f7c956~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,usm_0.66_1.00_0.01/bc6929_08ed15cc8bf6404c845f05abd5f7c956~mv2.jpg" },
    { title: "極月", content: "極月や\n生きてるだけで\n丸儲け", date: "2024-12-18", imageUrl: "https://static.wixstatic.com/media/bc6929_4a63a687f7c940e3b79869a851e0d6cd~mv2.jpg/v1/fill/w_351,h_535,al_c,lg_1,q_80/bc6929_4a63a687f7c940e3b79869a851e0d6cd~mv2.jpg" },
    { title: "子持ち鮎", content: "子持ち鮎\n人のお腹で\n産卵し", date: "2024-10-13", imageUrl: "https://static.wixstatic.com/media/bc6929_01f62f6dcc6e400d831d845b598bd68e~mv2.jpg/v1/fill/w_576,h_768,al_c,lg_1,q_85/bc6929_01f62f6dcc6e400d831d845b598bd68e~mv2.jpg" },
    { title: "秋桜（コスモス）", content: "感情の\n八重に揺らめく\n秋桜", date: "2024-09-29", imageUrl: "https://static.wixstatic.com/media/bc6929_962aa4645fb14157bb756c6fc0e9a0a4~mv2.jpg/v1/fill/w_579,h_640,al_c,q_85/bc6929_962aa4645fb14157bb756c6fc0e9a0a4~mv2.jpg" },
    { title: "マグロ解体ショー", content: "研ぎ澄ます\n刺身包丁\n梅雨晴間", date: "2024-07-07", imageUrl: "https://static.wixstatic.com/media/bc6929_2facbf98b1524fce9645d035b558261f~mv2.jpg/v1/fill/w_1000,h_646,al_c,q_85,usm_0.66_1.00_0.01/bc6929_2facbf98b1524fce9645d035b558261f~mv2.jpg" },
    { title: "蛞蝓（なめくじ・なめくじり）", content: "なめくじり\nやる気の無さは\n親譲り", date: "2024-06-03", imageUrl: "https://static.wixstatic.com/media/bc6929_e6ee6d5235ca4b108ade81efdca43b10~mv2.jpg/v1/fill/w_1000,h_563,al_c,q_85,usm_0.66_1.00_0.01/bc6929_e6ee6d5235ca4b108ade81efdca43b10~mv2.jpg" },
    { title: "つばめの子", content: "子沢山\nグループホームの\n軒つばめ", date: "2024-05-22", imageUrl: "https://static.wixstatic.com/media/bc6929_b97cd804e36946deb72d4a097adb55f8~mv2.jpg/v1/fill/w_1000,h_539,al_c,q_85,usm_0.66_1.00_0.01/bc6929_b97cd804e36946deb72d4a097adb55f8~mv2.jpg" },
    { title: "桜満開", content: "百回も\n寝て地震跡の\n桜かな", date: "2024-04-10", imageUrl: "https://static.wixstatic.com/media/bc6929_f7df1b7cc1fe4e10817528d336fbb941~mv2.jpg/v1/fill/w_576,h_768,al_c,lg_1,q_85/bc6929_f7df1b7cc1fe4e10817528d336fbb941~mv2.jpg" },
    { title: "虹の架け端", content: "春の海\n薄れかかりぬ\n虹の端", date: "2024-02-12", imageUrl: "https://static.wixstatic.com/media/bc6929_5fdba00e894a4b7ba4d90e168ef1b59c~mv2.jpg/v1/fill/w_1000,h_872,al_c,q_85,usm_0.66_1.00_0.01/bc6929_5fdba00e894a4b7ba4d90e168ef1b59c~mv2.jpg" },
    { title: "寒雀（かんすずめ）", content: "裸木に\nたわわに実る\n寒雀", date: "2024-01-24", imageUrl: "https://static.wixstatic.com/media/bc6929_e43fb027c3644151a4644f82ee080eae~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/bc6929_e43fb027c3644151a4644f82ee080eae~mv2.jpg" },
];

function getOldHaiku() {
    return oldHaikuData.map((item) => ({
        id: `old-${item.title}`,
        title: item.title,
        content: item.content,
        createdAt: new Date(item.date).toISOString(),
        imageUrl: item.imageUrl,
        imagePosition: "center",
        isOld: true,
    }));
}

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ page?: string; year?: string; month?: string }> }) {
    const params = await searchParams;
    const dbBlogs = await getBlogs();
    const oldHaiku = getOldHaiku();

    // DB の俳句と旧サイトの俳句を統合し、日付順に並べる
    const blogs = [...dbBlogs, ...oldHaiku].sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // --- 年月フィルタ ---
    const filterYear = params?.year;
    const filterMonth = params?.month;
    const filteredBlogs = (filterYear && filterMonth)
        ? blogs.filter((blog: any) => {
            const d = new Date(blog.createdAt);
            return d.getFullYear() === Number(filterYear) && (d.getMonth() + 1) === Number(filterMonth);
        })
        : blogs;

    // --- ページネーション設定 ---
    const currentPage = Number(params?.page) || 1;
    const perPage = 6;
    const totalPages = Math.ceil(filteredBlogs.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const currentBlogs = filteredBlogs.slice(startIndex, startIndex + perPage);

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
                                    {/* 左：本文（縦書き・太字・段下げ） */}
                                    {blog.content && (
                                        <div
                                            className="text-base text-gray-800 font-bold leading-relaxed"
                                            style={{ writingMode: "vertical-rl" }}
                                        >
                                            {blog.content.split("\n").map((line: string, i: number) => (
                                                <p key={i} style={{ marginTop: i === 1 ? "2em" : i === 2 ? "4em" : 0 }}>
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
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
                            <li>
                                <Link
                                    href="/blog"
                                    className={`flex justify-between items-center transition py-1 px-2 rounded hover:bg-green-50 ${!filterYear ? "text-green-800 font-semibold" : "text-gray-600 hover:text-green-800"}`}
                                >
                                    <span className="tracking-wider">すべて</span>
                                    <span className="text-xs text-gray-400">({blogs.length}句)</span>
                                </Link>
                            </li>
                            {archives.map(([key, count]) => {
                                const match = key.match(/(\d+)年(\d+)月/);
                                const year = match?.[1];
                                const month = match?.[2];
                                return (
                                    <li key={key}>
                                        <Link
                                            href={`/blog?year=${year}&month=${month}`}
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
