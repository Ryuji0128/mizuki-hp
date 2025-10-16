import DoctorMessage from '@/app/doctor/DoctorMessage';
import DoctorOutline from '@/app/doctor/DoctorOutline';
import ResponsiveAdjustmentContainer from "@/components/ResponsiveAdjustmentContainer";
import { themeConstants } from "@/theme/themeConstants";
import React from "react";

const BusinessIntroduction: React.FC = () => {
  const titlesOfPresidentMessageService = ["院長メッセージ"];
  const titlesOfCompanyOutline = ["経歴"];
  // const titlesOfCompanyHistory = ["経歴"];

  const titlesWidth = {
    xs: themeConstants.custom.subTitle.widthXs,
    sm: themeConstants.custom.subTitle.widthSm,
  };
  const contentWidth = {
    xs: themeConstants.custom.subTitle.widthXs,
    sm: 100 - themeConstants.custom.subTitle.widthSm,
  };

  return (
    <>
      {/* 院長メッセージ  */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfPresidentMessageService}
        rightComponent={<DoctorMessage />}
        imageSrc="/doctor/doctor1.jpg"
        imageWidth={200}
      />
      {/* 経歴 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfCompanyOutline}
        rightComponent={<DoctorOutline />}
        imageSrc="/doctor/doctor2.png"
        imageWidth={200}
      />
      {/* 沿革 */}
      {/* <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfCompanyHistory}
        rightComponent={<DoctorHistory />}
      /> */}
    </>
  );
};

export default BusinessIntroduction;
