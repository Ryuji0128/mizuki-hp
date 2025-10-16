import { Box, Typography } from "@mui/material";
import React from "react";

interface titleProps {
  japanseTitle: string;
  englishTitle: string;
  customPadding?: string;
}

const PageMainTitle: React.FC<titleProps> = ({ japanseTitle, englishTitle, customPadding }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: customPadding ? customPadding : "7rem 0", // 上下の余白
      }}
    >
      {/* 「お問い合わせ」の部分 */}
      <Typography
        variant="h4" // タイトルの大きさを設定
        component="h1" // h1タグとして扱う
        sx={{
          fontWeight: "bold", // 太字
          mb: 1, // 下部の余白 (margin-bottom)
        }}
      >
        {japanseTitle}
      </Typography>

      {/* "Inquiry" の部分 */}
      <Typography
        variant="subtitle1" // 小さめのフォントサイズ
        component="h2" // h2タグとして扱う
        sx={{
          color: "#555", // グレーの文字色
          fontStyle: "italic", // イタリック体
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // 影の設定
        }}
      >
        {englishTitle}
      </Typography>
    </Box>
  );
};

export default PageMainTitle;