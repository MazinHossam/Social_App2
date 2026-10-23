
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import { APP_EMAIL_PASSWORD, EMAIL_APP } from "../../../config/config";

export const SendEmail = async ({
  to,
  cc,
  bcc,
  subject,
  html,
  attachments = [],
}: Mail.Options) => {
  try {
    console.log("EMAIL FUNCTION STARTED");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: EMAIL_APP,
        pass: APP_EMAIL_PASSWORD,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    console.log("CONNECTING TO GMAIL SMTP...");

    await transporter.verify();

    console.log("GMAIL SMTP CONNECTION SUCCESSFUL");

    const info = await transporter.sendMail({
      from: `"Chat_App" <${EMAIL_APP}>`,
      to,
      cc,
      bcc,
      subject,
      html,
      attachments,
    });

    console.log("EMAIL SENT SUCCESSFULLY:", info.messageId);

    return info;
  } catch (error) {
    console.error("EMAIL SENDING FAILED:", error);
    throw error;
  }
};
