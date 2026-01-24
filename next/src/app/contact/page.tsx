import React from "react";
import ContactForm from "./ContactForm";
import ContactPageMainTitle from "./ContactPageMainTitle";
import { Box } from "@mui/material";

export default function ContactPage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <Box
      sx={{
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ContactPageMainTitle />
      <ContactForm recaptchaSiteKey={recaptchaSiteKey} />
    </Box>
  );
}
