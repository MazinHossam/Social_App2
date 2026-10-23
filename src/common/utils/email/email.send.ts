import nodemailer from "nodemailer";
import dns from "node:dns/promises";
import { APP_EMAIL_PASSWORD, EMAIL_APP } from "../../../config/config";

export const SendEmail = async (options: any) => {
  const addresses = await dns.resolve4("smtp.gmail.com");
  const gmailIPv4 = addresses[0];

  console.log("Gmail IPv4:", gmailIPv4);

  const transporter = nodemailer.createTransport({
    host: gmailIPv4,
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_APP,
      pass: APP_EMAIL_PASSWORD,
    },
    tls: {
      servername: "smtp.gmail.com",
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  });

  const info = await transporter.sendMail({
    ...options,
    from: `"Chat_App" <${EMAIL_APP}>`,
  });

  console.log("Email sent:", info.messageId);

  return info;
};