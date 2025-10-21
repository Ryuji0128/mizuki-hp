import { validateInquiry } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import xss from "xss";

export async function POST(req: NextRequest) {
  const inquiryData = await req.json();

  // サニタイズ
  const sanitizedData = {
    name: xss(inquiryData.name || ""),
    company: xss(inquiryData.company || ""),
    email: xss(inquiryData.email || ""),
    phone: xss(inquiryData.phone || ""),
    inquiry: xss(inquiryData.inquiry || ""),
  };

  // バリデーション
  const validateResult = validateInquiry(sanitizedData);
  if (Object.keys(validateResult).length > 0) {
    return NextResponse.json({ errors: validateResult }, { status: 400 });
  }

  try {
    // ✅ reCAPTCHA チェックを一時的にスキップ
    // if (!inquiryData.token) {
    //   return NextResponse.json({ success: false, message: "No reCAPTCHA token" }, { status: 400 });
    // }

    // nodemailer 設定
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminAddress = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

    // 自社宛メール
    await transporter.sendMail({
      from: `"みずきクリニック Webフォーム" <${process.env.SMTP_USER}>`,
      to: adminAddress,
      subject: `【お問い合わせ】${sanitizedData.name} 様より`,
      html: `
        <h3>新しいお問い合わせがありました。</h3>
        <p><strong>お名前:</strong> ${sanitizedData.name}</p>
        <p><strong>会社名:</strong> ${sanitizedData.company}</p>
        <p><strong>メール:</strong> ${sanitizedData.email}</p>
        <p><strong>電話番号:</strong> ${sanitizedData.phone}</p>
        <p><strong>お問い合わせ内容:</strong><br>${sanitizedData.inquiry}</p>
      `,
    });

    // 自動返信メール
    await transporter.sendMail({
      from: `"みずきクリニック" <${process.env.SMTP_USER}>`,
      to: sanitizedData.email,
      subject: "【自動返信】お問い合わせありがとうございます",
      html: `
        <p>${sanitizedData.name} 様</p>
        <p>このたびはお問い合わせありがとうございます。</p>
        <p>以下の内容で受け付けました。</p>
        <hr />
        <p>${sanitizedData.inquiry}</p>
        <hr />
        <p>２営業日以内に、担当者よりご連絡いたします。</p>
        <p>みずきクリニック<br>
        石川県金沢市みずき1丁目3-5<br>
        TEL: 076-255-0337<br>
        </p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json({ success: false, error: "送信に失敗しました" });
  }
}
