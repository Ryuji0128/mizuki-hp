import Message01 from '@/app/consultation/Message01';
import Message02 from '@/app/consultation/Message02';
import Message03 from '@/app/consultation/Message03';
import Message04 from '@/app/consultation/Message04';
import ResponsiveAdjustmentContainer from "@/components/ResponsiveAdjustmentContainer";
import { themeConstants } from "@/theme/themeConstants";
import React from "react";

const BusinessIntroduction: React.FC = () => {
  const titlesOfMessage01 = ["診療時間"];
  const titlesOfMessage02 = ["内科"];
  const titlesOfMessage03 = ["消化器科"];
  const titlesOfMessage04 = ["外科"];

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
      {/* 診療時間 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage01}
        rightComponent={<Message01 />}
        imageSrc="/time.png"
        imageWidth={100}
      />
      {/* 内科 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage02}
        rightComponent={<Message02 />}
        imageSrc="/naika.png"
        imageWidth={200}
      />
      {/* 消化器科 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage03}
        rightComponent={<Message03 />}
        imageSrc="/hukutsu.png"
        imageWidth={150}
      />
      {/* 外科 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage04}
        rightComponent={<Message04 />}
      />
    </>
  );
};

export default BusinessIntroduction;
