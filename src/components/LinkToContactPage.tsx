"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Box, Typography, Button, Link } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BaseContainer from "@/components/BaseContainer";

const LinkToContactPage = () => {
  const pathname = usePathname();

  // contactページでは非表示
  if (pathname === "/contact" || pathname === "/portal-login" || pathname.startsWith("/portal-admin")) {
    return null;
  }

  return (
    <BaseContainer backgroundColor="primary.main" marginBottom={10}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // モバイルは縦並び、デスクトップは横並び
          alignItems: "center", // 縦方向中央揃え
          justifyContent: { xs: "center", md: "space-around" }, // モバイルは中央揃え、デスクトップはspace-around
          textAlign: "center", // テキスト中央揃え
          color: "primary.contrastText", // テーマのコントラストテキスト
          padding: 4,
          borderRadius: "8px",
          gap: 3, // 要素間のスペース
        }}
      >
        {/* 左側テキスト */}
        <Box
          sx={{
            mb: { xs: 3, md: 0 }, // モバイルで下に余白
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
            }}
          >
            お問い合わせ
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontStyle: "italic", // Inquiry部分を斜体
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Inquiryに影
              marginBottom: 2,
            }}
          >
            Inquiry
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "primary.contrastText",
            }}
          >
            案件のご依頼・ご相談などのお問合せはこちら
          </Typography>
        </Box>

        {/* 右側ボタン */}
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <Link
            href="/contact"
            sx={{
              textDecoration: "none",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                color: "primary.contrastText",
                borderColor: "primary.contrastText",
                borderWidth: 2,
                padding: "10px 20px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "primary.contrastText",
                  "& .arrow-icon": {
                    transform: "translateX(4px)",
                    transition: "transform 0.3s ease-in-out",
                  },
                },
              }}
            >
              <Typography>お問い合わせフォーム</Typography>
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: "1.5rem",
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </Button>
          </Link>
        </Box>
      </Box>
    </BaseContainer>
  );
};

export default LinkToContactPage;
