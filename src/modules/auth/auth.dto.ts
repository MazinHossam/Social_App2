import z from "zod";
import { confirmEmailV, login, resendConfirmEmailV, ResendOTPForgetPasswordV, ResetPasswordV, sendOTPForgetPasswordV, signup, signupWithGmailV, VerifyOTPForgetPasswordV } from "./auth.validation";

export type LoginDto =z.infer<typeof login.body>
export type SignupDto =z.infer<typeof signup.body>
export type confirmEmailDto =z.infer<typeof confirmEmailV.body>
export type resendConfirmEmailDto =z.infer<typeof resendConfirmEmailV.body>

export type sendOTPForgetPasswordDto =z.infer<typeof sendOTPForgetPasswordV.body>
export type ResendOTPForgetPasswordDto =z.infer<typeof ResendOTPForgetPasswordV.body>
export type VerifyOTPForgetPasswordDto =z.infer<typeof VerifyOTPForgetPasswordV.body>
export type ResetPasswordDto =z.infer<typeof ResetPasswordV.body>
export type SignupWithGmailDto =z.infer<typeof signupWithGmailV.body>