import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 0.8 }}>
      <Typography variant="body1" lineHeight={2.0}>
        患者の皆様へ<br></br>
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          当院はマイナンバーカードによるオンライン資格確認を行なっています。
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          オンライン資格確認により診療情報を取得・活用し、質の高い医療の提供に努めています
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          正確な情報を取得するために・活用するために、マイナ保険証の利用にご協力をお願い致します。
        </ListItem>
      </List>
    </Box>
  );
}
