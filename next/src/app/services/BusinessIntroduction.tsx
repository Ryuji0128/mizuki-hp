import React from "react";
import ResponsiveAdjustmentContainer from "@/components/ResponsiveAdjustmentContainer";
import { themeConstants } from "@/theme/themeConstants";
import ContentsOfSaasService from "@/app/services/ContentsOfSaasService";
import ContentsOfWebsystemOutsourcing from "@/app/services/ContentsOfWebsystemOutsourcing";
import ContentsOfConsultingService from "@/app/services/ContentsOfConsultingService";

const BusinessIntroduction: React.FC = () => {
  const titlesOfSaasService = ["自社開発（SaaS）"];
  const titlesOfWebsystemOutsourcingService = ["ウェブシステム開発"];
  const titlesOfConsultingService = ["コンサルティング","サービス"];
  
  const titlesWidth = {
    xs: themeConstants.custom.subTitle.widthXs,
    sm: themeConstants.custom.subTitle.widthSm,
  };
  const contentWidth = {
    xs: themeConstants.custom.subTitle.widthXs,
    sm: 100 - themeConstants.custom.subTitle.widthSm,
  };

  //   const rightPaneWidthMd = 100 - themeConstants.custom.subTitle.widthMd;
  //   const rightPaneWidthLg = 100 - themeConstants.custom.subTitle.widthLg;

  return (
    <>
      {/* 自社開発（SaaS） */}  
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfSaasService}
        rightComponent={<ContentsOfSaasService />}
      />
      {/* ウェブシステム受託開発  */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfWebsystemOutsourcingService}
        rightComponent={<ContentsOfWebsystemOutsourcing />}
      />
      {/* コンサルティングサービス */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfConsultingService}
        rightComponent={<ContentsOfConsultingService />}
      />
    </>
  );
};

export default BusinessIntroduction;
