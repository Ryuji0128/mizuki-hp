import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 0.8 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#black", mb: 1 }}>
        プラセンタ注射ってなに？
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, ml: 4, }}>
        医療用プラセンタ注射薬は、厚生労働省に認められている医療用の医薬品です。<br></br>
        肝障害、更年期障害に使用されています。また、保険適用外ではありますが​、<br></br>
        次のような症状にも効果があるとされています。<br></br>
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 6 }}>
        <ListItem sx={{ display: "list-item" }}>
          疲れ、肩こり、腰痛、筋肉痛、関節痛
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          シミ、くすみ、肌荒れ、皮膚乾燥症、冷え性
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          自律神経失調症
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          月経困難症、生理不順
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          アレルギー疾患
        </ListItem>
      </List>
      <Typography variant="body1" sx={{ mb: 1, ml: 4, }}>
        ご興味のある方は、是非お問い合わせください<br></br>
        ➡メールでのお問い合わせはこちら<br></br>
        ・料金：プラセンタ注射1アンプルが1,500円、2アンプルが2,500円<br></br>
      </Typography>
    </Box>
  );
}
