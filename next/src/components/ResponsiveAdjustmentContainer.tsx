import { Box } from "@mui/material";
import React from "react";
import LeftSubtitleBox from "./LeftSubtitleBox";

interface ResponsiveAdjustmentContainerProps {
  titlesWidth: { xs: number; sm: number }; // 左側の幅（%）
  contentWidth: { xs: number; sm: number }; // 右側の幅（%）
  titles: string[]; // 2行以上のタイトルを受け取る;
  rightComponent: React.ReactNode; // 右側に表示するコンポーネント
  imageSrc?: string; // 画像のパス
  imageTitle?: string; // 画像のalt
  imageWidth?: string | number;
}

const ResponsiveAdjustmentContainer: React.FC<
  ResponsiveAdjustmentContainerProps
> = ({ titlesWidth, contentWidth, titles, rightComponent, imageSrc, imageTitle, imageWidth = 240, }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 3, sm: 4 },
        justifyContent: { xs: "center", sm: "flex-start" },
        alignItems: { xs: "center", sm: "flex-start" },
        textAlign: "left",
        pb: { xs: 5, sm: 6 },
        mb: { xs: 5, sm: 6 },
        borderBottom: "1px solid #e8e8e8",
        "&:last-child": {
          borderBottom: "none",
          mb: 0,
        },
      }}
    >
      {/* 左側コンポーネント */}
      <Box sx={{ width: { xs: `${titlesWidth.xs}%`, sm: `${titlesWidth.sm}%` } }}>
        <LeftSubtitleBox titles={titles} imageSrc={imageSrc} imageTitle={imageTitle} imageWidth={imageWidth} />
      </Box>

      {/* 右側コンポーネント */}
      <Box
        sx={{ width: { xs: `${contentWidth.xs}%`, sm: `${contentWidth.sm}%` } }}
      >
        {rightComponent}
      </Box>
    </Box>
  );
};

export default ResponsiveAdjustmentContainer;
