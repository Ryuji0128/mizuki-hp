import { Box, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* ① 検査前の充分な説明 */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}>
        ①検査前の充分な説明
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 2, lineHeight: 1.8 }}>
        胃カメラや大腸カメラ検査・治療を受けていただく前に充分な説明を行い、
        ご納得いただくまで対応いたします。ご質問にもお答えいたします。
      </Typography>

      {/* ② 検査 */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}>
        ②検査
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1, ml: 2, color: "#2a7d8f" }}>
        胃カメラ検査について
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, ml: 2, lineHeight: 1.8 }}>
        予約の状況により、昼食が軽食の場合、6時間以上絶食であれば夕方の内視鏡も可能です。
        まずは、お電話にてお問合せください。
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, ml: 2, color: "#2a7d8f" }}>
        大腸カメラ検査について
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, ml: 2, lineHeight: 1.8 }}>
        検査前に下剤を服用していただく必要があります。まずは、お電話にてお問合せください。
        当院では、内視鏡用炭酸ガス送気装置を導入しています。検査後の腹部膨満感が軽減され、
        快適な内視鏡検査を受けることが可能となりました。
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, ml: 2, color: "#2a7d8f" }}>
        日帰り大腸ポリープ切除術
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 2, lineHeight: 1.8 }}>
        当院では、大腸カメラ検査を行った際、ポリープが見つかった場合に、
        ご希望の方には即時に日帰り手術を行っています。
      </Typography>

      {/* ③ 検査後の充分な説明 */}
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}>
        ③検査後の充分な説明
      </Typography>
      <Typography variant="body1" sx={{ ml: 2, lineHeight: 1.8 }}>
        内視鏡検査や治療の際に撮影した画像を最新のデジタルビュアーでお示ししながら、
        ご説明いたします。
      </Typography>
    </Box>
  );
}
