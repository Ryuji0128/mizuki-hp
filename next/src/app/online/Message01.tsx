import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        新型コロナ感染の拡大に伴い、外出の自粛がより一層求められる状況で、
        医療機関を受診すべきかどうか迷う方も多いかと思います。
        そういう方々のために、LINEで健康相談を受け付けることにしました。
        文末のいずれかの方法でお友だち登録していただき、トーク機能でご相談ください。
        お待たせする場合もありますが、全て医師が対応いたします。
        是非、ご活用ください。
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}>
        ＜LINEお友だち登録方法＞
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          QRコード (ID: kimura.clinic)
        </ListItem>
      </List>
    </Box>
  );
}
