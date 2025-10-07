"use client";

import { useCallback, useRef, useState } from "react";
import { useReCaptcha } from "next-recaptcha-v3";
import Image from "next/image";
import {
  TextField,
  Button,
  Box,
  Typography,
  Modal,
  CircularProgress,
  Link,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { validateInquiry } from "@/lib/validation";
import BaseContainer from "@/components/BaseContainer";
import axios from "axios";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  inquiry?: string;
  company?: string;
}

const ContactForm = () => {
  const { executeRecaptcha } = useReCaptcha(); // reCAPTCHA token取得

  const nameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const inquiryRef = useRef<HTMLTextAreaElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    "loading" | "success" | "error"
  >("loading");

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 入力時のエラー解消
  const handleChange = (field: keyof FormErrors) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined, // 該当フィールドのエラーをクリア
    }));
  };

  // フォーム送信処理
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const token = await executeRecaptcha("form_submit");

      // フォームデータを取得
      const formData = {
        name: nameRef.current?.value || "",
        company: companyRef.current?.value || "",
        email: emailRef.current?.value || "",
        phone: phoneRef.current?.value || "",
        inquiry: inquiryRef.current?.value || "",
      };

      // バリデーション
      const validationErrors = validateInquiry(formData);
      setErrors(validationErrors);

      // エラーがある場合、送信を停止
      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      setIsModalOpen(true);
      setModalContent("loading");

      try {
        const recaptchaResponse = await axios.post("/api/recaptcha", {
          token,
        });

        if (recaptchaResponse.data.success) {
          await axios.post("/api/email", {
            ...formData,
            token,
          });

          setModalContent("success");

          // フォームリセット
          if (nameRef.current) nameRef.current.value = "";
          if (companyRef.current) companyRef.current.value = "";
          if (emailRef.current) emailRef.current.value = "";
          if (phoneRef.current) phoneRef.current.value = "";
          if (inquiryRef.current) inquiryRef.current.value = "";

          setErrors({});
        } else {
          setModalContent("error");
        }
      } catch (error) {
        console.error("送信エラー:", error);
        setModalContent("error");
      }
    },
    [executeRecaptcha]
  );

  return (
    <BaseContainer>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 600,
          margin: "auto",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          align="justify"
          paddingY={5}
          sx={{ textAlign: "justify", textJustify: "inter-word" }}
        >
          当社及び当社が提供するサービスに関するお問い合わせは、
          必須項目にご入力の上、下記フォームよりお気軽にお問い合わせください。
          <br></br>
          また、弊社の個人情報保護方針につきましては「プライバシーポリシー」ページをご覧ください。
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginBottom: "20px",
          }}
        >
          <TextField
            inputRef={nameRef}
            label="氏名・担当者名*"
            name="name"
            error={Boolean(errors.name)}
            helperText={errors.name}
            onChange={() => handleChange("name")}
            fullWidth
          />

          <TextField
            inputRef={companyRef}
            label="企業名"
            name="company"
            onChange={() => handleChange("company")}
            fullWidth
          />

          <TextField
            inputRef={emailRef}
            label="メールアドレス*"
            name="email"
            error={Boolean(errors.email)}
            helperText={errors.email}
            onChange={() => handleChange("email")}
            fullWidth
          />

          <TextField
            inputRef={phoneRef}
            label="電話番号"
            name="phone"
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            onChange={() => handleChange("phone")}
            fullWidth
          />

          <TextField
            inputRef={inquiryRef}
            label="お問い合わせ・ご依頼内容*"
            name="inquiry"
            error={Boolean(errors.inquiry)}
            helperText={errors.inquiry}
            onChange={() => handleChange("inquiry")}
            fullWidth
            multiline
            rows={4}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              width: "200px",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            送信
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Image
              src="/recaptcha.svg"
              alt="reCAPTCHA"
              width={40}
              height={40}
              style={{ marginRight: "10px", height: 40 }}
            />
            <Typography variant="body2" color="textSecondary">
              このサイトは reCAPTCHA によって保護されており、Google の
              <Link
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener"
                sx={{ marginLeft: "5px", marginRight: "5px" }}
              >
                プライバシーポリシー
              </Link>
              と
              <Link
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener"
                sx={{ marginLeft: "5px" }}
              >
                利用規約
              </Link>
              が適用されます。
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* モーダル */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: "10px",
          }}
        >
          {modalContent === "loading" && (
            <>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>お問い合わせ送信中...</Typography>
            </>
          )}
          {modalContent === "success" && (
            <>
              <CheckCircle sx={{ color: "green", fontSize: 50 }} />
              <Typography sx={{ mt: 2 }}>
                送信が完了しました。お問い合わせいただき、ありがとうございます。
              </Typography>
              <Typography sx={{ mt: 2 }}>
                ２営業日以内に、弊社担当者からご連絡いたします。
              </Typography>
              <Button onClick={closeModal} sx={{ mt: 2 }} variant="contained">
                閉じる
              </Button>
            </>
          )}
          {modalContent === "error" && (
            <>
              <Error sx={{ color: "red", fontSize: 50 }} />
              <Typography sx={{ mt: 2, color: "red" }}>
                送信に失敗しました。ウェブサイト管理者にお問い合わせください。
              </Typography>
              <Button onClick={closeModal} sx={{ mt: 2 }} variant="contained">
                閉じる
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </BaseContainer>
  );
};

export default ContactForm;
