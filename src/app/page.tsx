import { Box } from "@mui/material";
import React from "react";
import ConsultationOutline from "./_home/ConsultationOutline";
import ConsultationOutlineMainTitle from "./_home/ConsultationOutlineMainTitle";
import HeroTopSection from "./_home/HeroTopSection";
import MedicalHoursMainTitle from "./_home/MedicalHoursMainTitle";
import News from "./_home/News";
import NewsMainTitle from "./_home/NewsMainTitle";
import Reserve from "./_home/Reserve";
import ReserveMainTitle from "./_home/ReserveMainTitle";
import Message01 from "./consultation/Message01";

const HomePageContent: React.FC = () => {
  return (
    <Box>

      {/* トップセクション */}
      <HeroTopSection></HeroTopSection>

      {/* お知らせセクション */}
      <NewsMainTitle></NewsMainTitle>
      <News></News>

      {/* 診療案内セクション */}
      <ConsultationOutlineMainTitle></ConsultationOutlineMainTitle>
      <ConsultationOutline></ConsultationOutline>

      {/* 診療時間セクション */}
      <MedicalHoursMainTitle></MedicalHoursMainTitle>
      <Message01></Message01>

      {/* 人間ドック予約セクション */}
      <ReserveMainTitle></ReserveMainTitle>
      <Reserve></Reserve>


      {/* セクションの下にスペース */}
      <Box sx={{ height: "200px" }} />

    </Box>
  );
};

export default HomePageContent;
