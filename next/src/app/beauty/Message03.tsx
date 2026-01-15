import { Box, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
      {/* 検査費用 */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#000", mb: 2 }}
      >
        検査費用の概算（健康保険3割負担の方）
      </Typography>

      {/* 胃内視鏡 */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", mb: 1, ml: 2, color: "#004c80" }}
      >
        胃内視鏡（胃カメラ）
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, ml: 4 }}>
        初診料・前処置薬剤・採血　2,000円～3,000円<br />
        胃内視鏡（検査のみ）約4,000円<br />
        病理細胞検査（追加費用）3,000円～6,000円<br />
        合計6,000円～13,000円<br />
        検査後にお薬を処方する場合がありますので、約15,000円程度御用意ください。
        <br />
        <br />
        ◆ 1割負担の方は上記の3分の1程度でお考えください。<br />
        ◆ 経鼻・経口内視鏡とも上記金額です。<br />
        ◆ 状況により異なる場合がございます。ご不明な点がございましたら<br />
        {"　"}お気軽にお問い合わせください。
      </Typography>

      {/* 大腸内視鏡 */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", mb: 1, ml: 2, color: "#004c80" }}
      >
        大腸内視鏡（大腸カメラ）
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, ml: 4 }}>
        初再診料・前処置薬剤・採血　2,500円～4,000円<br />
        大腸内視鏡（検査のみ）約5,000円<br />
        病理細胞検査（追加費用）個数・部位により異なります　5,000円～12,000円<br />
        合計7,500円～18,000円
        <br />
        <br />
        ◆ 1割負担の方は上記の3分の1程度でお考えください。<br />
        ◆ 鎮静剤の使用などにより若干異なります。<br />
        ◆ 状況により異なる場合がございます。ご不明な点がございましたら<br />
        {"　"}お気軽にお問い合わせください。
      </Typography>

      {/* 大腸ポリープ切除術 */}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", mb: 1, ml: 2, color: "#004c80" }}
      >
        大腸ポリープ切除術（日帰り手術）
      </Typography>
      <Typography variant="body1" sx={{ mb: 6, ml: 4, }}>
        20,000円～30,000円<br />
        <br />
        ◆ 1割負担の方は上記の3分の1程度でお考えください。<br />
        ◆ 鎮静剤の使用などにより若干異なります。<br />
        ◆ 状況により異なる場合がございます。ご不明な点がございましたら<br />
        {"　"}お気軽にお問い合わせください。
      </Typography>
    </Box>
  );
}
