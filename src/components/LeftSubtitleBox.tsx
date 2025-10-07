import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface titleProps {
  titles: string[]; // 2行以上のタイトルを受け取る
  imageSrc?: string; // 画像のパス
  imageTitle?: string; // 画像のalt
}

const LeftSubtitleBox: React.FC<titleProps> = ({
  titles,
  imageSrc,
  imageTitle,
}) => {
  const greenLineLength = 8;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { md: "400px" }, // 左側の幅を制限
        display: "flex",
        flexDirection: { xs: "column-reverse", sm: "column" }, // モバイル: 縦並び, タブレット以上: 横並び
        alignItems: "flex-start", // 左揃え
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column", // モバイル: 縦並び, タブレット以上: 横並び
          alignItems: "flex-start", // 左揃え
        }}
      >
        {/* 黒い線 */}
        <Box
          sx={{
            width: "100%", // 黒い線の長さ
            height: "1px", // 黒い線の高さ
            backgroundColor: "info.light", // 黒い線の色
            marginBottom: `${-greenLineLength / 2}px`, // 緑の線の高さの半分だけ上にずらす
          }}
        />
        {/* 緑の短い線 */}
        <Box
          sx={{
            width: {
              xs: "4rem", // モバイル
              sm: "5rem", // タブレット
              md: "6rem", // PC
            }, // 緑の線の長さ
            height: `${greenLineLength}px`, // 緑の線の高さ
            backgroundColor: "secondary.main", // 緑の線の色
          }}
        />
      </Box>

      {/* タイトル部分 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "column" }, // モバイル: 横並び, タブレット以上: 縦並び
          flexWrap: "wrap", // モバイル時に折り返し防止
          // gap: { xs: "0.5rem", sm: "1rem" }, // 要素間の隙間
          width: "100%",
          paddingTop: 2,
          paddingBottom: { xs: 4 },
          justifyContent: "center",
        }}
      >
        {titles.map((title, index) => (
          <Typography
            key={index}
            variant="h3"
            sx={{
              lineHeight: 1.2,
              fontSize: {
                xs: "1.5rem", // モバイル
                sm: "1.5rem", // タブレット
                md: "1.7rem", // PC
              },
              whiteSpace: "nowrap", // モバイル時に改行を防止
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
            display: { xs: "none", sm: "flex" }, // モバイルで非表示, md以上で表示
            justifyContent: "center",
            paddingTop: 2,
          }}
        >
          <Image
            src={imageSrc}
            alt={imageTitle ?? ""}
            width={100} // 任意のダミー値
            height={100} // 任意のダミー値
            style={{ width: "100%", height: "auto" }} // パーセントの設定、画像の幅と高さをレスポンシブに調整
            sizes="100vw"
          />
        </Box>
      )}
    </Box>
  );
};

export default LeftSubtitleBox;
