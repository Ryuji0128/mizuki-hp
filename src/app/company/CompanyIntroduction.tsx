import React from "react";
import ResponsiveAdjustmentContainer from "@/components/ResponsiveAdjustmentContainer";
import { themeConstants } from "@/theme/themeConstants";
import ContentsOfPresidentMessage from "@/app/company/ContentsOfPresidentMessage";
import ContentsOfCompanyOutline from "@/app/company/ContentsOfCompanyOutline";
import ContentsOfCompanyHistory from "@/app/company/ContentsOfCompanyHistory";

const BusinessIntroduction: React.FC = () => {
  const titlesOfPresidentMessageService = ["代表メッセージ"];
  const titlesOfCompanyOutline = ["会社概要"];
  const titlesOfCompanyHistory = ["沿革"];
  
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
      {/* 代表メッセージ  */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfPresidentMessageService}
        // imageSrc=""
        // imageTitle=""
        rightComponent={<ContentsOfPresidentMessage />}
      />
      {/* 会社概要 */}  
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfCompanyOutline}
        rightComponent={<ContentsOfCompanyOutline />}
      />
      {/* 沿革 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfCompanyHistory}
        rightComponent={<ContentsOfCompanyHistory />}
      />
    </>
  );
};

export default BusinessIntroduction;
