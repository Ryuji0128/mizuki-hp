import Message01 from '@/app/discription/Message01';
import Message02 from '@/app/discription/Message02';
import Message03 from '@/app/discription/Message03';
import Message04 from '@/app/discription/Message04';
import ResponsiveAdjustmentContainer from "@/components/ResponsiveAdjustmentContainer";
import { themeConstants } from "@/theme/themeConstants";
import React from "react";

const BusinessIntroduction: React.FC = () => {
  const titlesOfMessage01 = ["検査"];
  const titlesOfMessage02 = ["診療報酬上の加算", "に係る掲示"];
  const titlesOfMessage03 = ["医療情報連携"];
  const titlesOfMessage04 = ["紹介先・提携病院"];

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
      {/* 検査  */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage01}
        rightComponent={<Message01 />}
        imageSrc="/discription/discription1.png"
        imageWidth={200}
      />
      {/* 診療報酬上の加算に係る掲示 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage02}
        rightComponent={<Message02 />}
        imageSrc="/discription/discription2.png"
        imageWidth={200}
      />
      {/* 医療情報連携 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage03}
        rightComponent={<Message03 />}
        imageSrc="/discription/discription3.png"
        imageWidth={200}
      />
      {/* 紹介先・提携病院 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage04}
        rightComponent={<Message04 />}
        imageSrc="/discription/discription4.png"
        imageWidth={200}
      />
    </>
  );
};

export default BusinessIntroduction;
