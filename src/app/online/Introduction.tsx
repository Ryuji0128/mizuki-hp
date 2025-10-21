import Message01 from '@/app/online/Message01';
import Message02 from '@/app/online/Message02';
import ResponsiveAdjustmentContainer from "@/components/ResponsiveAdjustmentContainer";
import { themeConstants } from "@/theme/themeConstants";
import React from "react";

const BusinessIntroduction: React.FC = () => {
  const titlesOfMessage01 = ["LINE健康相談"];
  const titlesOfMessage02 = ["オンライン診療"];

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
      {/* LINE健康相談 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage01}
        rightComponent={<Message01 />}
        imageSrc="/online/online1.png"
        imageWidth={100}
      />
      {/* オンライン診療 */}
      <ResponsiveAdjustmentContainer
        titlesWidth={titlesWidth}
        contentWidth={contentWidth}
        titles={titlesOfMessage02}
        rightComponent={<Message02 />}
        imageSrc="/online/online2.png"
        imageWidth={200}
      />
    </>
  );
};

export default BusinessIntroduction;
