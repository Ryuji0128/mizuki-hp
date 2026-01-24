import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface titleProps {
  titles: string[]; // 2行以上のタイトルを受け取る
  imageSrc?: string; // 画像のパス
  imageTitle?: string; // 画像のalt
  imageWidth?: string | number; // 画像サイズ
}

const LeftSubtitleBox: React.FC<titleProps> = ({
  titles,
  imageSrc,
  imageTitle,
  imageWidth = 240,
}) => {
  return (
    <Box
      sx={{
        width: imageWidth,
        maxWidth: { md: "400px" },
        display: "flex",
        flexDirection: { xs: "column-reverse", sm: "column" },
        alignItems: "flex-start",
      }}
    >
      {/* タイトル部分 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          flexWrap: "wrap",
          width: "100%",
          paddingBottom: { xs: 3 },
          justifyContent: "flex-start",
          borderLeft: "4px solid #2a7d8f",
          paddingLeft: 2,
        }}
      >
        {titles.map((title, index) => (
          <Typography
            key={index}
            variant="h3"
            sx={{
              lineHeight: 1.3,
              fontSize: {
                xs: "1.3rem",
                sm: "1.4rem",
                md: "1.5rem",
              },
              fontWeight: 600,
              color: "#1a1a1a",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        ))}
      </Box>
      {imageSrc && (
        <Box
          sx={{
            width: "100%",
            display: { xs: "none", sm: "flex" },
            justifyContent: "center",
            paddingTop: 2,
          }}
        >
          <Image
            src={imageSrc}
            alt={imageTitle ?? ""}
            width={100}
            height={100}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            sizes="100vw"
          />
        </Box>
      )}
    </Box>
  );
};

export default LeftSubtitleBox;
