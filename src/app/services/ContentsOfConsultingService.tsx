import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const ContentsOfConsultingService: React.FC = () => {
  return (
    <Box>
      {/* 強調タイトル */}
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        IT戦略から実行支援まで、一貫したコンサルティングをご提供します。
      </Typography>

      {/* 本文 */}
      <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
        当社は、お客様のビジネス課題を的確に分析し、最適なIT戦略を策定するコンサルティングサービスをご提供しています。システム導入や業務改善、さらには運用支援まで、実現可能なソリューションを一緒に設計し、課題解決をサポートします。
      </Typography>

      {/* 実績 */}
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", color: "secondary.main", mb: 2 }}
      >
        実績
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}
      >
        <List>
          {[
            "通信放送会社様",
            "小売業者様",
          ].map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText
                primary={`・ ${item}`}
                primaryTypographyProps={{ variant: "body1", sx: { lineHeight: 1.8 } }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ContentsOfConsultingService;