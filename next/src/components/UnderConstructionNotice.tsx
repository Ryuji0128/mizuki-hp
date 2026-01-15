'use client'

import React from "react";
import { Box, Typography } from "@mui/material";

const UnderConstructionNotice = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        bgcolor: "background.default",
        color: "primary.main",
        textAlign: "center",
      }}
    >
      {/* 装飾付きタイトル */}
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: "bold",
          letterSpacing: "0.2rem",
          mb: 3,
          position: "relative",
          "&::after": {
            content: '""',
            display: "block",
            width: "50%",
            height: "4px",
            backgroundColor: "primary.main",
            margin: "8px auto 0",
          },
        }}
      >
        準備中
      </Typography>

      {/* サブテキスト */}
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          color: "text.secondary",
          fontWeight: "light",
        }}
      >
        現在コンテンツを準備しています。
      </Typography>
    </Box>
  );
};

export default UnderConstructionNotice;