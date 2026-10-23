"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendEmail = void 0;
const promises_1 = __importDefault(require("node:dns/promises"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../../config/config");
const SendEmail = async ({ to, cc, bcc, subject, html, attachments = [], }) => {
    try {
        console.log("EMAIL FUNCTION STARTED");
        const addresses = await promises_1.default.resolve4("smtp.gmail.com");
        console.log("GMAIL IPV4 ADDRESSES:", addresses);
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            family: 4,
            auth: {
                user: config_1.EMAIL_APP,
                pass: config_1.APP_EMAIL_PASSWORD,
            },
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            socketTimeout: 20000,
        });
        console.log("CONNECTING TO GMAIL SMTP...");
        await transporter.verify();
        console.log("GMAIL SMTP CONNECTION SUCCESSFUL");
        const info = await transporter.sendMail({
            from: `"Chat_App" <${config_1.EMAIL_APP}>`,
            to,
            cc,
            bcc,
            subject,
            html,
            attachments,
        });
        console.log("EMAIL SENT SUCCESSFULLY:", info.messageId);
        return info;
    }
    catch (error) {
        console.error("EMAIL SENDING FAILED:", error);
        throw error;
    }
};
exports.SendEmail = SendEmail;
