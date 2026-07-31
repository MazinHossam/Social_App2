import nodemailer from 'nodemailer'
import { APP_EMAIL_PASSWORD, EMAIL_APP } from '../../../config/config';
import Mail from 'nodemailer/lib/mailer';


export const SendEmail =async({
    to,
    cc,
    bcc,
    subject, 
    html,
    attachments=[]
    
}:Mail.Options)=>{
    const transporter = nodemailer.createTransport({
 service:'gmail',
  auth: {
    user: EMAIL_APP,
    pass: APP_EMAIL_PASSWORD,
  },
});


  const info = await transporter.sendMail({

     to,
     cc,
     bcc,
     subject,
     html,
     from: `"Chat_App" <${EMAIL_APP}>`,

    
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));



}