
// slick-carousel の CSS をインポート 
// yarn add react-slick slick-carousel
// yarn add -D @types/react-slick

"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import Slider from "react-slick";

// slick-carousel の CSS をインポート
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const HeroTopSection: React.FC = () => {
  const settings = {
    dots: true, // 下部にドットを表示
    infinite: true, // 無限ループ
    speed: 800, // スライドのスピード(ms)
    slidesToShow: 1, // 一度に表示するスライド数
    slidesToScroll: 1, // 一度にスクロールするスライド数
    autoplay: true, // 自動再生
    autoplaySpeed: 4000, // 自動再生の間隔(ms)
    arrows: false, // 左右の矢印を非表示（必要なら true に）
  };

  const slides = [
    {
      image: "/top/image1.jpg",
      // title: "地域に寄り添う医療を",
      // subtitle: "みずきクリニックへようこそ",
    },
    {
      image: "/top/image2.jpg",
      // title: "安心・信頼の医療体制",
      // subtitle: "あなたの健康をサポートします",
    },
    {
      image: "/top/image3.jpg",
      // title: "笑顔のある日常を",
      // subtitle: "心と体のケアを大切に",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1020px",
          height: "500px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                height: "500px",
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  // backgroundColor: "rgba(0, 0, 0, 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  {slide.title}
                </Typography>
                <Typography variant="body1">{slide.subtitle}</Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default HeroTopSection;