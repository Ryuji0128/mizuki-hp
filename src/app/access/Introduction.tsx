import Message01 from '@/app/access/Message01';
import ResponsiveAdjustmentContainer from "@/components/ResponsiveAdjustmentContainer";
import { themeConstants } from "@/theme/themeConstants";
import React from "react";

const BusinessIntroduction: React.FC = () => {
  const titlesOfMessage01 = ["交通アクセス"];

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
      {/* 交通アクセス */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage01}
        rightComponent={<Message01 />}
        imageSrc="/access/access1.png"
        imageWidth={200}
      />
    </>
  );
};

export default BusinessIntroduction;
