const https = require("https");

function fetchXML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(data));
            res.on("error", reject);
        });
    });
}

function extractTag(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
    const match = xml.match(regex);
    if (!match) return "";
    return (match[1] || match[2] || "").trim();
}

function stripHtml(html) {
    return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").trim();
}

(async () => {
    const xml = await fetchXML("https://www.mizuki-clinic.jp/blog-feed.xml");

    const items = xml.split("<item>").slice(1);

    const posts = items.map((item) => {
        const title = extractTag(item, "title");
        const pubDate = extractTag(item, "pubDate");
        const description = extractTag(item, "description");
        const content = stripHtml(description);

        // 日付を整形
        const date = pubDate ? new Date(pubDate).toLocaleDateString("ja-JP") : "";

        return { title, content, date };
    });

    console.log(JSON.stringify(posts, null, 2));
    console.log(`\n合計: ${posts.length}件`);
})();
