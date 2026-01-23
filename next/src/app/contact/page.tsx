import React from "react";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import ContactForm from "./ContactForm";
import ContactPageMainTitle from "./ContactPageMainTitle";
import { Box } from "@mui/material";

export default function ContactPage() {
  return (
    <Box
      sx={{
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        useRecaptchaNet={true}
      >
        <ContactPageMainTitle />
        <ContactForm />
      </ReCaptchaProvider>
    </Box>
  );
}
