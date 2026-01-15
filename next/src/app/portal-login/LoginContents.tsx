import React from "react";
import { Box, Paper } from "@mui/material";
import BaseContainer from "@/components/BaseContainer";
import GoogleLoginButton from "./GoogleLoginButton";
import CredentialsLoginForm from "./CredentialsLoginForm";

export default function LoginContents() {
  return (
    <BaseContainer>
      <Box display="flex" alignItems="center">
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: 500,
            margin: "auto",
          }}
        >
          {/* Credentials ログイン */}
          <CredentialsLoginForm />

          {/* GOOGLE ログイン */}
          <GoogleLoginButton />
        </Paper>
      </Box>
    </BaseContainer>
  );
}