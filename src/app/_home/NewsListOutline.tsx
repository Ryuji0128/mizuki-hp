import { Box, Typography, Link } from "@mui/material";
// import { newsMockdata } from "@/lib/mock";
import BaseContainer from "@/components/BaseContainer";
import axios from "axios";
import { headers } from "next/headers";

interface INewsList {
  id: number;
  title: string;
  contents: string[];
  date: string;
  updatedAt: Date;
  url?: string | null;
}

async function getNewsList() {
  // Todo: プロトコルとホストの取得コードを共通化して、libに置く。

  // const host = (await headers()).get("host"); // リクエストのホストを取得
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = process.env.ENVIRONMENT === "development" ? "http" : "https";
  const response = await axios.get<{ news: INewsList[] }>(`${protocol}://${host}/api/news`);
  const dateFormatted = response.data.news.map((news) => {
    return {
      ...news,
      date: new Date(news.date).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  });
  return dateFormatted;
  // const response = await fetch("/api/news", { cache: "no-store" }); // SSR の場合 no-store
  // if (!response.ok) {
  //   throw new Error("Failed to fetch news");
  // }
  // const data = await response.json();
  // return data.news;
}

const NewsSection = async () => {
  const newsList = await getNewsList();
  return (
    <BaseContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // xsでは縦並び、sm以上で横並び
          alignItems: { xs: "center", sm: "flex-start" }, // xsでは中央揃え、sm以上で左揃え
          justifyContent: "center",
          padding: "5rem 0", // 上下の余白
        }}
      >
        {/* NEWSタイトル */}
        <Box
          sx={{
            position: "relative",
            marginBottom: { xs: 4, sm: 0 }, // xsでは余白を設定、sm以上では右余白
            marginRight: { sm: 2 }, // sm以上では右余白を設定
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            NEWS
          </Typography>
          {/* 下線装飾 */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: { xs: "50%", sm: 0 }, // xsでは中央寄せ、smでは左寄せ
              transform: { xs: "translateX(-50%)", sm: "none" }, // xsで中央揃えの変換
              width: { xs: "50%", sm: "100%" }, // xsでは幅50%、smでは100%
              height: "4px",
              backgroundColor: "primary.main",
              borderRadius: "2px",
            }}
          />
        </Box>

        {/* コンテンツボックス */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            height: newsList.length >= 3 ? { xs: "33vh", sm: "40vh" } : "auto", // 配列の数によって高さを設定
            overflowY: "auto",
            borderRadius: "12px",
            padding: "35px 20px",
            backgroundColor: "background.paper",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 影を追加
          }}
        >
          {/* ニュースコンテンツをmapで展開 */}
          {newsList.map((news, index) => (
            <Box
              key={index}
              sx={{
                mb: 3,
                pb: 2,
                borderBottom: { xs: "none", sm: "1px solid #ddd" }, // xs以下では非表示、sm以上で線表示
                "&:last-child": {
                  borderBottom: "none", // 最後のアイテムは線を表示しない
                },
              }}
            >
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                {news.date}
              </Typography>
              <Link
                href="/news"
                sx={{
                  color: "text.primary",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main",
                  },
                  textDecoration: { xs: "underline", sm: "none" }, // xs以下で下線、sm以上ではホバー時のみ
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {news.title}
                </Typography>
              </Link>
            </Box>
          ))}
          <Link
            href="/news"
            sx={{
              display: "block",
              textAlign: "center",
              color: "text.primary",
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
                color: "primary.main",
              },
              textDecoration: { xs: "underline", sm: "none" }, // xs以下で下線、sm以上ではホバー時のみ
            }}
          >
            お知らせ一覧へ
          </Link>
        </Box>
      </Box>
    </BaseContainer>
  );
};

export default NewsSection;
