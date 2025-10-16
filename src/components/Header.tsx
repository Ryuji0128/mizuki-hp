"use client";

import { useSimpleBar } from "@/components/SimpleBarWrapper";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { scrollContainerRef } = useSimpleBar();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => setScrolled(scrollContainer.scrollTop > 200);
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  const contentsList = [
    { title: "クリニック概要", href: "/discription" },
    { title: "診療案内", href: "/consultation" },
    { title: "内視鏡検査", href: "/endoscopy" },
    { title: "在宅医療", href: "/home-medical-care" },
    { title: "美容・健康", href: "/beauty" },
    { title: "医師紹介", href: "/doctor" },
    { title: "アクセス", href: "/access" },
    { title: "お問い合わせ", href: "/contact" },
    { title: "オンライン診療", href: "/online" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled ? "primary.main" : "transparent",
          transition: "background-color 0.5s ease",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: { xs: 56, md: 64 },
            px: 0,
          }}
        >
          {/* 左：ロゴ（画面端） */}
          <Box sx={{ flexShrink: 0, pl: { xs: 1, md: 2 } }}>
            <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
              <Box display="flex" alignItems="center">
                <Image
                  src="/mizuki_logo_transparent.jpg"
                  alt="みずきクリニックロゴ"
                  height={isTablet ? 30 : 40}
                  width={isTablet ? 30 : 40}
                />
                <Typography
                  variant="h6"
                  sx={{
                    ml: 1,
                    fontSize: { xs: "16px", md: "20px" },
                    color: scrolled ? "info.pale" : "info.dark",
                  }}
                >
                  みずきクリニック
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* 右：メニューをBaseContainer幅に合わせる */}
          <Container
            maxWidth="lg"
            sx={{
              px: { xs: 2, md: 0 },
              display: "flex",
              justifyContent: "flex-start", // ← カルーセル左端に合わせる
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: { xs: 0.5, md: 0 },
              }}
            >
              {contentsList.map((content, index) => (
                <Link key={index} href={content.href} passHref>
                  <Button
                    sx={{
                      color: scrolled ? "info.pale" : "info.dark",
                      fontSize: { xs: "13px", md: "15px" },
                      px: { xs: 0.8, md: 1.5 },
                    }}
                  >
                    {content.title}
                  </Button>
                </Link>
              ))}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>


      <Box sx={{ ...theme.mixins.toolbar }} />
    </>
  );
}
