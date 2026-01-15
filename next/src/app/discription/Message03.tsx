import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message02() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
      <Typography variant="body1" lineHeight={2.0}>
        当院ではハートネットホスピタルに参加しています。<br></br>
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          医療情報連携とは病院と診療所、医師とコメディカルがスムーズに連携するための<br></br>
          患者情報共有システムのことで、施設間で患者さんの情報を共有することにより<br></br>
          質の高い医療及び介護の提供を目的としています。
        </ListItem>
      </List>
    </Box>
  );
}
