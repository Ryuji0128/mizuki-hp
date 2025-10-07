"use client";

import { googleAuthenticate } from "@/actions/google-login";
import { useActionState } from "react";
import { BsGoogle } from "react-icons/bs";
import { Box, Button, Typography } from "@mui/material";

const GoogleLogin = () => {
  
  const [errorMsgGoogle, dispatchGoogle] = useActionState(googleAuthenticate, undefined);
  return (
    <Box
      component="form"
      maxWidth={400}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%", // 幅を100%に
        marginTop: 3, // `mt-4` の代替
        gap: 2, // 各要素の間隔を均等に
      }}
      action={dispatchGoogle}
    >
      <Button
        type="submit"
        variant="outlined"
        fullWidth
        sx={{
          textTransform: "capitalize", // 最初の文字大文字、それ以降小文字
          color: "black", // 黒い文字色
          borderColor: "black", // 黒いボーダー
          height: 50,
          fontSize: "1rem", // フォントサイズを1.25remに
        }}
      >
        <BsGoogle />
        　Googleログイン
      </Button>
      <Typography>{errorMsgGoogle?.messages.join(", ")}</Typography>
    </Box>
  );
};

export default GoogleLogin;
