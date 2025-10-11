"use client";

import { useSimpleBar } from "@/components/SimpleBarWrapper";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProfileConsoleModal from "./ProfileConsoleModal";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { scrollContainerRef } = useSimpleBar();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrolled(scrollContainer.scrollTop > 200);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  interface Content {
    title: string;
    href: string;
  }

  const contentsList: Content[] = [
    { title: "会社概要", href: "/company" },
    { title: "事業紹介", href: "/services" },
    { title: "お知らせ", href: "/news" },
    { title: "採用情報", href: "/recruit" },
    { title: "お問い合わせ", href: "/contact" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled ? "primary.main" : "transparent",
          transition: "background-color 0.5s ease",
          zIndex: 1100,
        }}
      >
        <Toolbar>
          <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
            >
              <Image
                src="/seta_logo_transparent.png"
                alt="瀬田製作所ロゴ"
                height={isTablet ? 30 : 40}
                width={isTablet ? 30 : 40}
              />
              <Typography
                variant="h6"
                sx={{
                  cursor: "pointer",
                  color: scrolled ? "info.pale" : "info.dark",
                  transition: "color 0.5s ease",
                  marginLeft: "0.5rem",
                  fontSize: { xs: "16px", md: "20px" },
                }}
              >
                瀬田製作所
              </Typography>
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {isMobile ? (
            <>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                <MenuIcon sx={{ color: scrolled ? "info.pale" : "info.dark" }} />
              </IconButton>
              <SessionProvider>
                <ProfileConsoleModal />
              </SessionProvider>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {contentsList.map((content, index) => (
                  <MenuItem key={index} onClick={handleMenuClose}>
                    <Link href={content.href} passHref>
                      <Typography sx={{ textDecoration: "none", color: "inherit" }}>{content.title}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <>
              {contentsList.map((content, index) => (
                <Link key={index} href={content.href} passHref>
                  <Button
                    sx={{
                      color: scrolled ? "info.pale" : "info.dark",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                      fontSize: { xs: "13px", md: "15px" },
                      padding: { xs: "0.5rem 0.4rem", md: "0.5rem 0.7rem" },
                    }}
                  >
                    {content.title}
                  </Button>
                </Link>
              ))}
              <SessionProvider>
                <ProfileConsoleModal />
              </SessionProvider>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ ...theme.mixins.toolbar }} /> {/* Headerバーがfixedによりディスプレイの高さとして無視されているため、同じ高さのボックスを配置  */}
    </>
  );
}