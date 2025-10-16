import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 0.8 }}>
      <Typography variant="body1" lineHeight={2.0}>
        当院では、「かかりつけ医」機能を有する診療所として機能強化加算を算定しております。<br></br>
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          健康診断の結果などの健康管理に係る相談に応じます。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          保健・福祉サービスの利用等に関する相談に応じます。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          訪問診療を行なっている患者様に対し、夜間・休日の問合せへの対応を行います。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          必要に応じて、専門医・専門医療機関を紹介します。
        </ListItem>
      </List>
    </Box>
  );
}
