import React from "react";
import { Box, SxProps, Theme } from "@mui/material";

interface ResponsiveBoxProps {
  children: React.ReactNode;
  width: {
    xs: string;
    sm?: string; // オプション
    md?: string; // オプション
    lg?: string; // オプション
  };
}

const ResponsiveBox: React.FC<ResponsiveBoxProps> = ({ children, width }) => {
  // レスポンシブ幅の動的処理
  const responsiveWidth: SxProps<Theme> = {
    width: {
      xs: width.xs,
      ...(width.sm && { sm: width.sm }),
      ...(width.md && { md: width.md }),
      ...(width.lg && { lg: width.lg }),
    },
  };

  return (
    <Box
      sx={{
        ...responsiveWidth, // 動的に生成した幅
        display: "flex",
        justifyContent: { xs: "center", sm: "flex-start" }, // モバイル: 中央揃え, タブレット以上: 左揃え
        alignItems: "center", // 垂直方向中央揃え
        textAlign: "left", // テキストは常に左揃え
      }}
    >
      {children}
    </Box>
  );
};

export default ResponsiveBox;