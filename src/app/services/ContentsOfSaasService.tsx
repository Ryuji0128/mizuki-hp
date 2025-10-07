import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const SaaSDevelopmentContent: React.FC = () => {
  return (
    <>
      {/* 強調タイトル */}
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        最新の技術を活用した高品質なSaaSソリューションをご提供します。
      </Typography>

      {/* 本文 */}
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        当社は、クラウドベースのSaaS（Software as a Service）ソリューションを自社開発しています。お客様の業務効率化や課題解決を目的とし、企画から設計、開発、運用まで一貫して対応。高品質なサービスを提供することで、多くの業界で信頼をいただいています。
      </Typography>

      {/* セクション見出し */}
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", color: "secondary.main", mb: 2 }}
      >
        サービスの特徴
      </Typography>

      {/* リスト項目 */}
      {[
        {
          title: "■ 拡張性",
          description:
            "必要に応じたカスタマイズやスケーラブルな設計で、多様なニーズに対応。",
        },
        {
          title: "■ セキュリティ重視",
          description:
            "高度なセキュリティ対策を導入し、データ保護と安心の運用環境を実現します。",
        },
        {
          title: "■ 運用支援とサポート",
          description:
            "クラウド基盤を活用した即時導入が可能。導入後の運用サポートも充実。",
        },
      ].map((item, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant="h6" component="h4" sx={{ mb: 1 }}>
            {item.title}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {item.description}
          </Typography>
        </Box>
      ))}

      {/* 開発実績 */}
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", color: "secondary.main", mb: 2 }}
      >
        開発実績
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
            "組織管理業務代替システム",
            "IT研修用システム",
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
    </>
  );
};

export default SaaSDevelopmentContent;