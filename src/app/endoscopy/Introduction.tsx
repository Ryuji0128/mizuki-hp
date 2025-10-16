import Message01 from '@/app/endoscopy/Message01';
import Message02 from '@/app/endoscopy/Message02';
import Message03 from '@/app/endoscopy/Message03';
import ResponsiveAdjustmentContainer from "@/components/ResponsiveAdjustmentContainer";
import { themeConstants } from "@/theme/themeConstants";
import React from "react";

const BusinessIntroduction: React.FC = () => {
  const titlesOfMessage01 = ["内視鏡設備"];
  const titlesOfMessage02 = ["内視鏡検査"];
  const titlesOfMessage03 = ["検査費用の概算"];

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
      {/* 内視鏡設備 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage01}
        rightComponent={<Message01 />}
        imageSrc="/endoscopy/endoscopy1.png"
        imageWidth={200}
      />
      {/* 内視鏡検査 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage02}
        rightComponent={<Message02 />}
        imageSrc="/endoscopy/endoscopy2.png"
        imageWidth={200}
      />
      {/* 検査費用の概算 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage03}
        rightComponent={<Message03 />}
        imageSrc="/endoscopy/endoscopy3.png"
        imageWidth={150}
      />
    </>
  );
};

export default BusinessIntroduction;
