import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 0.8 }}>

      <Typography variant="body1" sx={{ mb: 1, ml: 4, }}>
        新型コロナ感染の拡大に伴い、外出の自粛がより一層求められる状況で、<br></br>
        医療機関を受診すべきかどうか迷う方も多いかと思います。<br></br>
        そういう方々のために、LINEで健康相談を受け付けることにしました。<br></br>
        文末のいずれかの方法でお友だち登録していただき、トーク機能でご相談ください。<br></br>
        お待たせする場合もありますが、全て医師が対応いたします。<br></br>
        是非、ご活用ください。<br></br>
        <br></br>
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#black", mb: 1 }}>
        ＜LINEお友だち登録方法＞
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 6 }}>
        <ListItem sx={{ display: "list-item" }}>
          QRコード (ID: kimura.clinic)
        </ListItem>
      </List>
    </Box>
  );
}
