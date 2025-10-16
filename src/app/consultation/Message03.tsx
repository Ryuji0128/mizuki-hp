import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message02() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 0.8 }}>
      <Typography variant="body1" lineHeight={5.0}>
        消化器外科学会、消化器内視鏡学会、消化器病学会の専門医として下記疾患に対応させて頂きます。<br></br>
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          逆流性食道炎
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          胃、十二指腸潰瘍
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          萎縮性胃炎
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          胃癌
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          ヘリコバクターピロリ除菌
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          機能性ディスペプシア
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          大腸ポリープ
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          炎症性腸疾患
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          過敏性大腸炎
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          痔核
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          肝臓、胆嚢、膵臓疾患等
        </ListItem>
      </List>
    </Box>
  );
}
