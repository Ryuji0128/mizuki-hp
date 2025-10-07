import React from "react";
import { Box, Container } from "@mui/material";
import { themeConstants } from "@/theme/themeConstants";

interface BaseContainerProps {
  children: React.ReactNode;
  backgroundImageSrc?: string; // 背景画像のパス
  backgroundColor?: string;
  marginBottom?: number;
}

const BaseContainer: React.FC<BaseContainerProps> = ({
  children,
  backgroundImageSrc,
  backgroundColor,
  marginBottom
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: backgroundColor? backgroundColor : "transparent", // テーマから取得
        backgroundImage: backgroundImageSrc
          ? `url(${backgroundImageSrc})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        marginBottom: marginBottom? marginBottom : 0, // 基本のパディング（theme.spacingを内部で解決）
      }}
    >
      <Container
        sx={{
          width:"100%",
          // maxWidthはテーマから自動取得されている（lg）
          margin: "0 auto", // コンテンツを中央揃え
          padding: 2, // 基本のパディング（theme.spacingを内部で解決）
          // Todo: レスポンシブ対応、テーマから取得
          // [theme.breakpoints.up("sm")]: {　themeを直接インポートしても、この書き方はエラーになる。use client定義で問題なく稼働する。
          [`@media (min-width:${themeConstants.breakpoints.values.sm}px)`]: {
            padding: 3, // タブレット以上
          },
          [`@media (min-width:${themeConstants.breakpoints.values.md}px)`]: {
            padding: 4, // PCサイズ
          },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default BaseContainer;