import { Box, List, ListItem, Typography } from "@mui/material";
export default function DoctorIntroduction() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2 }}>
        みずきクリニックは、地域の皆様に対して快適で、納得できる、安心な医療を提供することのできる
        『気持ちの良いクリニック』であることを目指します。
      </Typography>
      <List sx={{ listStyleType: "decimal", pl: 4 }}>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          正しい診断と治療への入口として、「人」を熟知し、地域に根ざしたホームドクターの使命を果たします。
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          提携する医療機関や医師と連携を図り、きめの細かい在宅医療を提供します。
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          患者さんの症状を緩和すると共に、科学的根拠に基づいた治療を行います。
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          患者さんの権利を尊重（医療の自己選択が出来る・十分な説明を受けられる・プライバシーの保護）し、
          患者さんのニーズにあった医療を提供します。
        </ListItem>
        <ListItem sx={{ display: "list-item", py: 0.5, lineHeight: 1.8 }}>
          仲間とのコミュニケーションの充実、人間関係の構築を図り、働きがいのある職場にします。
        </ListItem>
      </List>
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="subtitle1"
          align="left"
          sx={{ fontFamily: 'Yuji Syuku', fontSize: "1.5rem" }}
        >
          院長: 木村 寛伸
        </Typography>
      </Box>
    </Box>
  );
}
