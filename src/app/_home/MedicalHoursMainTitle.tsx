import BaseContainer from "@/components/BaseContainer";
import PageMainTitle from "@/components/PageMainTitle";

const MedicalHoursMainTitle = () => {
  return (
    <BaseContainer>
      <PageMainTitle
        japanseTitle="診療時間"
        englishTitle="Medical hours"
        customPadding="5rem 0 0rem 0"
      ></PageMainTitle>
    </BaseContainer>
  );
};

export default MedicalHoursMainTitle;
