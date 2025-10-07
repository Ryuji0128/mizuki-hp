"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validation";
import { Typography, TextField, Button, Box, Divider, Link } from "@mui/material";
import { signIn } from "next-auth/react";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function CredentialsLoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const { email, password } = data;
    try {
      const result = await signIn("credentials", {
        redirect: false,
        // redirectTo: "/",
        email,
        password,
      });
      if (!result?.error) {
        window.location.href = "/";
      } else {
        throw new Error("ログインに失敗しました。パスワードとメールアドレスを確認してください。");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box
      width="100%"
      maxWidth={400}
      sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      component="form"
      action="submit"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Email Field */}
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      {/* Password Field */}
      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />

      {/* LOGIN ボタン */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          height: 50,
          textTransform: "capitalize", // 最初の文字大文字、それ以降小文字
          fontSize: "1rem", // フォントサイズを1remに
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "ログイン"}
      </Button>

      {/* ユーザー登録リンク */}
      <Typography variant="body2" sx={{ marginTop: "1rem", textAlign: "center" }}>
        ユーザー登録がまだの方は{" "}
        <Link
          href="/portal-admin/register-user"
          sx={{ textDecoration: "none", fontWeight: "bold" }}
        >
          こちら
        </Link>
      </Typography>

      {/* OR Divider：中央線はClientでのみ表現される（SSRは不可）ため、本コンポーネントで実装 */}
      <Divider>OR</Divider>
    </Box>
  );
}
