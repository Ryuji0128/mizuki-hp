import BaseContainer from "@/components/BaseContainer";
import NewsList from "./NewsList";
import { SessionProvider } from "next-auth/react";

const NewsPageDetails = () => {
  return (
    <BaseContainer>
      <SessionProvider>
        <NewsList></NewsList>
      </SessionProvider>
    </BaseContainer>
  );
};

export default NewsPageDetails;