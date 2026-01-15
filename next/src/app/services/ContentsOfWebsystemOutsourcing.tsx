import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const BusinessIntroduction: React.FC = () => {
  return (
    <>
      {/* 強調タイトル */}
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        高品質なシステム開発を、要件定義から開発・運用まで幅広くサポートします。
      </Typography>

      {/* 本文 */}
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        当社の開発チームは、時代のニーズに合わせた技術を採用し、企画立案から設計、開発、品質管理まで一貫して対応可能です。お客様のご要望や課題をしっかりと把握し、最適なソリューションを提供することで、プロジェクトの成功をお手伝いします。
      </Typography>

      {/* セクション見出し */}
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", color: "secondary.main", mb: 2 }}
      >
        私たちの強み
      </Typography>

      {/* リスト項目 */}
      {[
        {
          title: "■ 専門知識",
          description:
            "当社には、最新の技術を駆使してシステム開発を行う経験豊富なエンジニアが在籍しています。要件定義や設計などの初期段階から、実装、テスト、運用サポートに至るまで、各工程でお客様をしっかりサポートします。お客様の課題解決に向けた実用的な提案と、高い品質を追求した成果をご提供します。",
        },
        {
          title: "■ 開発体制",
          description:
            "アジャイル開発手法などのフレキシブルな開発体制を採用しており、迅速な対応と柔軟なサポートを実現します。高い生産性と確実な品質を両立し、お客様の満足度向上に努めます。",
        },
        {
          title: "■ 保守サポート",
          description:
            "長期的な保守体制を整え、アプリケーションの定期的な保守やサポートを提供し、お客様のビジネスの成功をサポートいたします。",
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

      {/* 保有スキルセット一覧 */}
      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: "bold", color: "secondary.main", mb: 2 }}
      >
        保有スキルセット一覧
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          backgroundColor: "background.paper",
          borderRadius: 2,
          mb: 2
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>[OS]</strong>
          <br />
          Windows / Windows Server / Linux / UNIX / iOS / Android
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>[開発環境]</strong>
          <br />
          Visual Studio / Eclipse / XCode / Android Studio
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>[言語]</strong>
          <br />
          Python / JavaScript / PHP / Perl / C# / VB.NET / Java / C / C++ / SQL / VBA /
          VB / Swift / SwiftUI
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>[WEB / Framework]</strong>
          <br />
          HTML / CSS / jQuery / React / Angular / Vue.js / Bootstrap / Tailwind
          CSS / Next.js / Django / Ruby on Rails / ASP.NET / Laravel / Flask
        </Typography>
        <Typography variant="body1">
          <strong>[開発支援ツール]</strong>
          <br />
          Backlog / Redmine / Trello / Asana / GitHub / GitLab /
          Bitbucket / Jenkins / Docker / Kubernetes / CircleCI /
          Slack / Microsoft Teams
        </Typography>
      </Paper>
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
            "コンテンツ配信システム",
            "人材管理、在庫管理システム",
            "業績管理システム",
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

export default BusinessIntroduction;
