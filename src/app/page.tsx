import React from "react";
import { Box } from "@mui/material";
import HeroTopSection from "./_home/HeroTopSection";
import AboutFusetsuMainTitle from "./_home/AboutFusetsuMainTitle";
import AboutFusetsuDetail from "./_home/AboutFusetsuDetail";
import CaseStudyDetails from "./_home/CaseStudyDetails";
import CaseStudyMainTitle from "./_home/CaseStudyMainTitle";
import NewsListOutline from "./_home/NewsListOutline";

const HomePageContent: React.FC = () => {
  return (
    <Box>

      {/* トップセクション */}
      <HeroTopSection></HeroTopSection>

      {/* お知らせセクション */}
      <NewsListOutline></NewsListOutline>

      {/* 会社案内セクション */}
      <AboutFusetsuMainTitle></AboutFusetsuMainTitle>
      <AboutFusetsuDetail></AboutFusetsuDetail>

      {/* 導入事例セクション */}
      <CaseStudyMainTitle></CaseStudyMainTitle>
      <CaseStudyDetails></CaseStudyDetails>

      {/* セクションの下にスペース */}
      <Box sx={{ height: "200px" }} />

    </Box>
  );
};

export default HomePageContent;
