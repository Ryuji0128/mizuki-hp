import { Box, Typography } from "@mui/material";

export default function Message02() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
        がん関連遺伝子とは？
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 4, }}>
        がん関連遺伝子には、正常細胞のがん化を促進する”がん遺伝子”（アクセル）と<br></br>
        がんの発生を抑制する”がん抑制遺伝子”（ブレーキ）があります。<br></br>
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
        がんリスク評価とは？
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 4, }}>
        多数のがん関連遺伝子の活性状態などを調べ、<br></br>
        現在のからだのがんリスクを総合的に評価するものです。<br></br>
        リスク段階が高くなるほど、がん患者が含まれる割合が増えます。<br></br>
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
        他のがん検診との違いは？
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 4, }}>
        従来の画像検診では、がんは5mm以上の大きさにならないと見つかりにくい<br></br>
        と言われています。しかし、がん細胞はたった1つのがん細胞が<br></br>
        長い年月をかけて増殖し、初めて目に見える大きさになります。<br></br>
        Can Tect検査では、その見えない段階をリスクとして可視化します。<br></br>
        がんの予防、早期発見には両方の検査をうまく組み合わせて定期的に受診することが効果的です。<br></br>
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
        検査方法は？
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, ml: 4, }}>
        約2mlの採血または唾液キットによる試料の採取をします。<br></br>
        約1カ月後検査機関より当クリニックへ検査結果が届きます。<br></br>
      </Typography>

      <Typography variant="body1" sx={{ mb: 1, ml: 4, }}>
        ご興味のある方は、是非お問い合わせください<br></br>
        ➡メールでのお問い合わせはこちら<br></br>
      </Typography>
    </Box>
  );
}
