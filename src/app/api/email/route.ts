import { getPrismaClient } from "@/lib/db";
import { fetchSecret } from "@/lib/fetchSecrets";
import { getMsalAccessToken } from "@/lib/msal";
import { validateInquiry } from "@/lib/validation";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import xss from "xss";

export async function GET() {
  try {
    const prisma = await getPrismaClient();
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" }, // 最新の問い合わせが上に来るように
    });

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("問い合わせ一覧の取得に失敗:", error);
    return NextResponse.json({ error: "問い合わせ一覧の取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const inquiryData = await req.json();

  const secretName = "OUTLOOK_EMAIL";

  const emailFrom = await fetchSecret(secretName);

  // サニタイズ処理を追加
  const sanitizedData = {
    name: xss(inquiryData.name || ""),
    company: xss(inquiryData.company || ""),
    email: xss(inquiryData.email || ""),
    phone: xss(inquiryData.phone || ""),
    inquiry: xss(inquiryData.inquiry || ""),
  };

  const validateResult = validateInquiry(sanitizedData);
  if (Object.keys(validateResult).length > 0) {
    return NextResponse.json({ errors: validateResult }, { status: 400 });
  }

  try {
    const accessToken = await getMsalAccessToken();
    const prisma = await getPrismaClient();

    // A 顧客宛のメールコンテンツを定義
    const customerEmailContent = {
      message: {
        subject: "【みずきクリニック】お問い合わせをお受けしました",
        body: {
          contentType: "HTML",
          content: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
              ${sanitizedData.company
              ? `<p style="width: 100%;"><strong>${sanitizedData.company}</strong></p>`
              : ""
            }
              <div style="margin-left: 10px; width: 100%;">
                <p>
                  ${sanitizedData.name} 様
                </p>
                <p>
                  この度は、みずきクリニックへお問い合わせいただき、誠にありがとうございます。<br>
                  弊社担当にて、お送りいただきました内容を確認の上、追ってご連絡いたします。
                </p>
                <p>今後とも、弊社をよろしくお願いいたします。</p>
              </div>
              <div style="border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9; display: flex; flex-wrap: wrap; justify-content: center; align-items: center;">
                <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; margin: 20px;">
                  <img src="https://fusetsu.co.jp/mizuki_logo_transparent.jpg" alt="みずきクリニックロゴ" 
                      style="width: 50px; height: auto; margin-right: 10px;">
                  <span style="font-weight: bold; text-align: center;">みずきクリニック</span>
                </div>
                <p style="margin:20px; text-align: center;">
                  〒521-0312　滋賀県米原市上野 709<br>
                  TEL: 090-6900-8231<br>
                  MAIL: ${emailFrom}
                </p>
              </div>
            </div>
          `,
        },
        toRecipients: [
          {
            emailAddress: {
              address: sanitizedData.email,
            },
          },
        ],
      },
    };

    // B 内部メールのコンテンツを定義
    const internalEmailContent = {
      message: {
        subject: "【お客様お問い合わせ通知】",
        body: {
          contentType: "HTML",
          content: `
            <p>新しいお問い合わせを受信しました。</p>
            <p><strong>氏名:</strong> ${sanitizedData.name}</p>
            <p><strong>企業名:</strong> ${sanitizedData.company}</p>
            <p><strong>メールアドレス:</strong> ${sanitizedData.email}</p>
            <p><strong>電話番号:</strong> ${sanitizedData.phone}</p>
            <p><strong>お問い合わせ内容:</strong><br>${sanitizedData.inquiry}</p>
          `,
        },
        toRecipients: [
          {
            emailAddress: {
              address: emailFrom, // 自社のメールアドレス
            },
          },
        ],
      },
    };

    // MSメールサービスにメール送信リクエストを送信

    // A' お客様へのメール送信
    const customerResponse = await axios.post(
      `https://graph.microsoft.com/v1.0/users/${emailFrom}/sendMail`,
      customerEmailContent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (customerResponse.status !== 202) {
      throw new Error(
        `お客様へのメール送信に失敗しました: ${customerResponse.statusText}`
      );
    }

    // B' 自社へのメール送信
    const internalResponse = await axios.post(
      `https://graph.microsoft.com/v1.0/users/${emailFrom}/sendMail`,
      internalEmailContent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // メールの内容をデータベースに登録
    await prisma.inquiry.create({
      data: {
        name: sanitizedData.name,
        company: sanitizedData.company,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        inquiry: sanitizedData.inquiry,
      },
    });

    if (internalResponse.status !== 202) {
      throw new Error(
        `自社へのメール送信に失敗しました: ${internalResponse.statusText}`
      );
    }

    return NextResponse.json({ message: "メールが送信されました" });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "IDが必要です" }, { status: 400 });
    }

    const prisma = await getPrismaClient();
    await prisma.inquiry.delete({ where: { id } });

    return NextResponse.json({ message: "問い合わせを削除しました" });
  } catch (error) {
    console.error("問い合わせの削除に失敗:", error);
    return NextResponse.json({ error: "問い合わせの削除に失敗しました" }, { status: 500 });
  }
}