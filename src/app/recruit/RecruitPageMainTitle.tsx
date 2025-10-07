import BaseContainer from "@/components/BaseContainer";
import PageMainTitle from "@/components/PageMainTitle";
import UnderConstructionNotice from "@/components/UnderConstructionNotice";

const ContactPageMainTitle = () => {
  return (
    <BaseContainer>
      <PageMainTitle
        japanseTitle="採用情報"
        englishTitle="Recruitment"
      ></PageMainTitle>
      <UnderConstructionNotice />
    </BaseContainer>
  );
};

export default ContactPageMainTitle;
