import type { Metadata } from "next";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LinkToContactPage from "@/components/LinkToContactPage";
import { SimpleBarWrapper } from "@/components/SimpleBarWrapper";

export const metadata: Metadata = {
  title: "風雪株式会社 | Fusetsu",
  description:
    "風雪株式会社は、Webアプリケーションやモバイルアプリの開発を中心に、多様なプロジェクトで信頼を得ているエンジニアチームです。先進技術を用いた、最適なソリューションを提供します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SimpleBarWrapper>
              <Header />
              {children}
              <LinkToContactPage />
              <Footer />
            </SimpleBarWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}