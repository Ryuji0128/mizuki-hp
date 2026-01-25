import { Box, List, ListItem, Typography } from "@mui/material";

export default function Message01() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}>
        当院で接種可能なワクチン
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          インフルエンザワクチン
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          コロナワクチン
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          帯状疱疹ワクチン
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          風疹・麻疹ワクチン
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          肺炎球菌ワクチン
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.3 }}>
          B型肝炎ワクチン
        </ListItem>
      </List>
    </Box>
  );
}
