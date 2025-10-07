"use client";

import React, { useState, useEffect } from "react";
import { Typography, Box, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material";
import { useSimpleBar } from "@/components/SimpleBarWrapper";

// ランダムな値を生成する関数
const getRandomValue = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

// 三角形データ生成関数
const generateTriangles = (count: number) => {
  return Array.from({ length: count }, () => {
    const attachToRight = Math.random() > 0.5; // 50%の確率で右端か下端に接する
    return {
      size: getRandomValue(100, 300), // サイズ
      opacity: getRandomValue(0.4, 1.0), // 透明度
      bottom: attachToRight ? 0 : `${getRandomValue(0, 50)}%`, // 下端に接する場合
      right: attachToRight ? `${getRandomValue(0, 50)}%` : 0, // 右端に接する場合
      rotation: getRandomValue(-30, 30), // 回転角度
    };
  });
};

// HexカラーをRGBに変換する関数
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// 線形補間（Lerp）関数
const lerp = (start: number, end: number, t: number): number =>
  start + t * (end - start);


const HeroTopSection: React.FC = () => {
    const theme = useTheme();
    const { scrollContainerRef } = useSimpleBar();

    const [scrollY, setScrollY] = useState(0);

  const isMobile = useMediaQuery(`(max-width:${theme.breakpoints.values.sm}px)`);
  const isTablet = useMediaQuery(`(max-width:${theme.breakpoints.values.md}px)`);
  const appBarHeight = isMobile ? theme.custom.header.height.mobile : theme.custom.header.height.desktop ; // モバイル: 56px, デスクトップ: 64px

  const fontSize = isMobile ? "3rem" : isTablet ? "6rem" : "8rem";
  const justifyContent = isMobile || isTablet ? "center" : "flex-start";
  const alignItems = isMobile || isTablet ? "center" : "flex-start";
  const paddingTop = isMobile || isTablet ? 0 : "15vh";

  // 三角形データの状態管理
  const [triangles, setTriangles] = useState<
    { size: number; opacity: number; bottom: string | number; right: string | number; rotation: number }[]
  >([]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    setTriangles(generateTriangles(5)); // 5つの三角形を生成

    const handleScroll = () => {
      setScrollY(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

    // スクロール位置に基づいて色を補間
const calculateColor = (scrollY: number) => {
  const startColor = hexToRgb(theme.palette.primary.light); 
  const targetColor = hexToRgb(theme.palette.primary.main); 

  const t = Math.min(scrollY / 300, 1); // 0から1の範囲で補間
  const r = Math.round(lerp(startColor.r, targetColor.r, t));
  const g = Math.round(lerp(startColor.g, targetColor.g, t));
  const b = Math.round(lerp(startColor.b, targetColor.b, t));

  return `rgb(${r}, ${g}, ${b})`;
};  

  return (
    <Box
      display="flex"
      justifyContent={justifyContent}
      alignItems={alignItems}
      height={`calc(100vh - ${appBarHeight}px)`} // 100vhからAppBarの高さを引く
      bgcolor="#f5f5f5"
      pt={paddingTop}
      pl={isMobile || isTablet ? 0 : "5vw"}
      position="relative"
      overflow="hidden"
      flexDirection="column"
    >
      {/* テキストの影 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          transform: "translateY(30px) scale(1.2)",
          color: "rgba(0, 0, 0, 0.2)",
          zIndex: 0,
        }}
      >
        <Typography variant="h1" sx={{ fontSize, fontWeight: "bold", textAlign: "left" }}>
          Fusetsu
        </Typography>
        <Typography variant="h1" sx={{ fontSize, fontWeight: "bold", textAlign: "left" }}>
          Corporation
        </Typography>
      </motion.div>

      {/* テキスト */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize,
            fontWeight: "bold",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            textAlign: "left",
          }}
        >
          Fusetsu
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize,
            fontWeight: "bold",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
            textAlign: "left",
          }}
        >
          Corporation
        </Typography>
      </motion.div>

      {/* ランダムな三角形 */}
      {triangles.map((triangle, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            bottom: triangle.bottom,
            right: triangle.right,
            width: `${triangle.size}px`,
            height: `${triangle.size}px`,
            backgroundColor: calculateColor(scrollY), // 色の補間
            clipPath: "polygon(0 0, 100% 50%, 0 100%)", // 三角形
            transform: `rotate(${triangle.rotation}deg)`,
            opacity: triangle.opacity,
            zIndex: 0,
          }}
        ></Box>
      ))}
    </Box>
  );
};

export default HeroTopSection;