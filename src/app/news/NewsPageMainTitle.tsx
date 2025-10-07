import BaseContainer from "@/components/BaseContainer";
import PageMainTitle from "@/components/PageMainTitle";
import { auth } from "@/lib/auth";

const NewsPageMainTitle = async () => {
  const session = await auth();
  const isRegister = session ? "Register" : "";
  return (
    <BaseContainer>
      <PageMainTitle
        japanseTitle={isRegister ? "お知らせ管理" : "お知らせ"}
        englishTitle={isRegister ? "News Management" : "News"}
      ></PageMainTitle>
    </BaseContainer>
  );
};

export default NewsPageMainTitle;