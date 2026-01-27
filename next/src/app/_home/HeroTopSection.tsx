"use client";

import { Box, Typography } from "@mui/material";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

const HeroTopSection: React.FC = () => {
  const slides = [
    { image: "/top/image1.jpg", title: "" },
    { image: "/top/image2.jpg", title: "" },
    { image: "/top/image3.jpg", title: "" },
    { image: "/top/image4.jpg", title: "" },
    { image: "/top/image5.jpg", title: "" },
    { image: "/top/image6.jpg", title: "" },
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
          maxWidth: "800px",
          height: "550px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          speed={800}
          style={{ width: "100%", height: "100%" }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  position: "relative",
                  height: "500px",
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  textAlign: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                  }}
                >
                  {slide.title}
                </Typography> */}
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default HeroTopSection;