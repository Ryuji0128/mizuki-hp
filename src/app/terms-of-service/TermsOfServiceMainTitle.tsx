import BaseContainer from "@/components/BaseContainer";
import PageMainTitle from "@/components/PageMainTitle";
import UnderConstructionNotice from "@/components/UnderConstructionNotice";

const TermsOfServiceMainTitle = () => {
  return (
    <BaseContainer>
      <PageMainTitle
        japanseTitle="利用規約"
        englishTitle="Terms of Service"
      ></PageMainTitle>
      <UnderConstructionNotice />
    </BaseContainer>
  );
};

export default TermsOfServiceMainTitle;
