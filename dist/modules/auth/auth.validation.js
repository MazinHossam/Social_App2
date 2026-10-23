"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupWithGmailV = exports.ResetPasswordV = exports.VerifyOTPForgetPasswordV = exports.ResendOTPForgetPasswordV = exports.sendOTPForgetPasswordV = exports.resendConfirmEmailV = exports.confirmEmailV = exports.signup = exports.login = void 0;
const zod_1 = require("zod");
const Validation_1 = require("../../common/Validation");
exports.login = {
    body: zod_1.z.object({
        email: Validation_1.generalVlaidation.email,
        password: Validation_1.generalVlaidation.password,
        FCM: zod_1.z.string().optional()
    })
};
exports.signup = {
    body: exports.login.body.safeExtend({
        username: Validation_1.generalVlaidation.username,
        confirmPassword: Validation_1.generalVlaidation.confirmPassword,
        phone: Validation_1.generalVlaidation.phone,
        gender: Validation_1.generalVlaidation.gender.optional()
    }).refine((data) => {
        return data.password === data.confirmPassword;
    }, { error: "Password mismatch with confirm password" }),
};
exports.confirmEmailV = {
    body: zod_1.z.object({
        email: Validation_1.generalVlaidation.email,
        OTP: Validation_1.generalVlaidation.OTP
    })
};
exports.resendConfirmEmailV = {
    body: zod_1.z.object({
        email: Validation_1.generalVlaidation.email,
    })
};
exports.sendOTPForgetPasswordV = {
    body: zod_1.z.object({
        email: Validation_1.generalVlaidation.email,
    })
};
exports.ResendOTPForgetPasswordV = {
    body: zod_1.z.object({
        email: Validation_1.generalVlaidation.email,
    })
};
exports.VerifyOTPForgetPasswordV = {
    body: zod_1.z.object({
        email: Validation_1.generalVlaidation.email,
        OTP: Validation_1.generalVlaidation.OTP
    })
};
exports.ResetPasswordV = {
    body: zod_1.z.object({
        email: Validation_1.generalVlaidation.email,
        OTP: Validation_1.generalVlaidation.OTP,
        password: Validation_1.generalVlaidation.password
    })
};
exports.signupWithGmailV = {
    body: zod_1.z.object({
        idToken: zod_1.z.string()
    })
};
