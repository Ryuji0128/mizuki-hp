import BaseContainer from "@/components/BaseContainer";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

interface CaseStudy {
  id: number;
  desktopSrc: string;
  phoneSrc: string;
  title: string;
  description: string;
  url?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    desktopSrc: "/dairione_desktop.png",
    phoneSrc: "/dairione_phone.png",
    title: "代理ONE業務管理・代行システム",
    description:
      "「代理ONE」は、企業のあらゆる管理業務を一つのアプリで完結できる革新的なプラットフォームです。人材、在庫、顧客、経費の管理機能をシームレスに統合し、経営者や担当者の負担を大幅に軽減します。さらに、AI機能を活用することで、経費シミュレーションや顧客の購買傾向を基にしたマーケティング戦略の立案、さらには全社的な経費削減案の提示を実現。業務効率を高めるだけでなく、顧客満足度の向上と社内の生産性向上を同時にサポートします。",
  },
  // {
  //   id: 2,
  //   desktopSrc: "/macbook-desktop1.png",
  //   phoneSrc: "/iphone1.png",
  //   title: "リアルタイム在庫追跡",
  //   description: "リアルタイムの在庫追跡により、供給チェーンを最適化。",
  // },
  // {
  //   id: 3,
  //   desktopSrc: "/macbook-desktop1.png",
  //   phoneSrc: "/iphone1.png",
  //   title: "売上予測システム",
  //   description: "売上予測をもとに効果的な販売戦略をサポート。",
  // },
];

const CaseStudyDetails = () => {
  return (
    <BaseContainer>
      <Box
        sx={{
          py: 8,
          bgcolor: "background.default",
          textAlign: "center",
        }}
      >
        {caseStudies.map((study) => (
          <Box
            key={study.id}
            sx={{
              position: "relative",
              textAlign: "center",
              mb: 20, // 各事例間のマージン
            }}
          >
            {/* デスクトップ画像 */}
            <Box
              sx={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "0px 0px 30px 0px",
                position: "relative",
                zIndex: 2, // パソコン画像を前面に配置
              }}
            >
              <Image
                src={study.desktopSrc}
                alt={`${study.title} Desktop`}
                width={600}
                height={300}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              {/* スマートフォン画像 */}
              <Box
                sx={{
                  position: "absolute", // デスクトップ画像の右下に固定
                  bottom: 0,
                  right: 0,
                  width: { xs: "20vw" },
                  maxWidth: "150px",
                  zIndex: 1, // デスクトップ画像の後ろに配置
                }}
              >
                <Image
                  src={study.phoneSrc}
                  alt={`${study.title} Phone`}
                  width={150}
                  height={300}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </Box>
            </Box>

            {/* テキストとボタン */}
            <Box
              sx={{
                mt: 4,
                textAlign: "center",
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {study.title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, lineHeight: 1.8 }}>
                {study.description}
              </Typography>
              {study.url && ( // URLがある場合のみボタンを表示
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 3,
                    px: 4,
                    py: 1,
                    fontSize: "1rem",
                  }}
                  href="/app-page" // 適切なリンクを設定
                >
                  アプリページへ移動
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </BaseContainer>
  );
};

export default CaseStudyDetails;
