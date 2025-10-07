import React from "react";
import LoginMainTitle from "./LoginMainTitle";
import LoginContents from "./LoginContents";
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  // Todo: middleware若しくはauth.ts(config含む)にて同様の設定が可能、かつパフォーマンス向上が期待できるため、今後改修予定
  const session = await auth();
  if(session){
    redirect('/');
  };

return (
    <>
      <LoginMainTitle></LoginMainTitle>
      <LoginContents></LoginContents>
    </>
  );
}
