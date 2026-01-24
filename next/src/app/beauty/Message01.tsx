import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}>
        プラセンタ注射ってなに？
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, ml: 2, lineHeight: 1.8 }}>
        医療用プラセンタ注射薬は、厚生労働省に認められている医療用の医薬品です。
        肝障害、更年期障害に使用されています。また、保険適用外ではありますが​、
        次のような症状にも効果があるとされています。
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          疲れ、肩こり、腰痛、筋肉痛、関節痛
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          シミ、くすみ、肌荒れ、皮膚乾燥症、冷え性
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          自律神経失調症
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          月経困難症、生理不順
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          アレルギー疾患
        </ListItem>
      </List>
      <Typography variant="body1" sx={{ mt: 2, ml: 2, lineHeight: 1.8 }}>
        ご興味のある方は、是非お問い合わせください<br />
        ➡メールでのお問い合わせはこちら<br />
        ・料金：プラセンタ注射1アンプルが1,500円、2アンプルが2,500円
      </Typography>
    </Box>
  );
}
