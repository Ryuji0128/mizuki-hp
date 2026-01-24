import { Box, Typography } from "@mui/material";
import React from "react";

interface titleProps {
  japanseTitle: string;
  englishTitle: string;
  customPadding?: string;
}

const PageMainTitle: React.FC<titleProps> = ({ japanseTitle, englishTitle, customPadding }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: customPadding ? customPadding : "5rem 0",
      }}
    >
      <Typography
        variant="subtitle2"
        component="p"
        sx={{
          color: "#2a7d8f",
          fontStyle: "italic",
          letterSpacing: "0.15em",
          mb: 1,
          fontSize: "0.85rem",
        }}
      >
        {englishTitle}
      </Typography>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          letterSpacing: "0.05em",
          position: "relative",
          display: "inline-block",
          pb: 2,
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 40,
            height: 3,
            backgroundColor: "#2a7d8f",
            borderRadius: 2,
          },
        }}
      >
        {japanseTitle}
      </Typography>
    </Box>
  );
};

export default PageMainTitle;