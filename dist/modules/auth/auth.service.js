"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../common/enums");
const email_enums_1 = require("../../common/enums/email.enums");
const exceptions_1 = require("../../common/exceptions");
const redise_service_1 = __importDefault(require("../../common/service/redise.service"));
const email_service_1 = __importDefault(require("../../common/utils/email/email.service"));
const Notification_service_1 = __importDefault(require("../../common/utils/Notification/Notification.service"));
const security_1 = require("../../common/utils/security");
const token_service_1 = __importDefault(require("../../common/utils/security/token.service"));
const user_repo_1 = __importDefault(require("../../DB/DB.Repository/user.repo"));
const google_auth_library_1 = require("google-auth-library");
class AuthService {
    _userRepository = user_repo_1.default;
    _tokenService = token_service_1.default;
    _emailsevice = email_service_1.default;
    _redisMethod = redise_service_1.default;
    _notificationService = Notification_service_1.default;
    async login(bodyData) {
        const { email, password } = bodyData;
        const user = await this._userRepository.findOne({
            filter: { email }
        });
        if (!user) {
            throw new exceptions_1.NotFoundException("invalid info");
        }
        const ispasswordvalid = await (0, security_1.generateCompare)({
            plainText: password,
            hashedText: user.password
        });
        if (!ispasswordvalid) {
            throw new exceptions_1.NotFoundException("invalid info");
        }
        if (!user.confirmEmail) {
            throw new exceptions_1.BadRequestException("Please confirm your email");
        }
        if (bodyData.FCM) {
            await this._redisMethod.addToSet(user._id, bodyData.FCM);
            const tokens = await this._redisMethod.getSetMembers(user._id);
            await this._notificationService.sendNotifications({
                tokens,
                notification: {
                    title: "User Logged In",
                    body: `You have successfully logged in ${new Date()}`
                }
            });
        }
        const { accessToken, refreshtoken } = this._tokenService.generateToken(user);
        return { accessToken, refreshtoken };
    }
    async signup(data) {
        console.log("SIGNUP: Started");
        const userExist = await this._userRepository.findOne({
            filter: { email: data.email }
        });
        if (userExist) {
            throw new exceptions_1.ConfilectException("User already exists");
        }
        const user = await this._userRepository.createOne({
            data: {
                ...data,
                password: await (0, security_1.generateHash)({
                    plainText: data.password
                }),
                confirmEmail: false
            }
        });
        console.log("SIGNUP: User created:", user.email);
        console.log("SIGNUP: Sending confirmation OTP...");
        await this._emailsevice.sendEmailOTP({
            email: user.email,
            emailType: email_enums_1.EmailTypeEnum.confirmEmail,
            subject: "Verify Your Email"
        });
        console.log("SIGNUP: Confirmation email request completed");
        return {
            message: "Account created. Please check your email for the verification code.",
            email: user.email
        };
    }
    async confirmedEmail(bodyData) {
        const { email, OTP } = bodyData;
        const user = await this._userRepository.findOne({
            filter: { email }
        });
        if (!user) {
            throw new exceptions_1.NotFoundException("invalid info");
        }
        if (user.confirmEmail) {
            throw new exceptions_1.BadRequestException("Email already confirmed");
        }
        const OTPkey = this._redisMethod.getOTPkey({
            email,
            emailType: email_enums_1.EmailTypeEnum.confirmEmail
        });
        const OTPstore = await this._redisMethod.get(OTPkey);
        if (!OTPstore) {
            throw new exceptions_1.NotFoundException("invalid OTP");
        }
        const compareOTP = await (0, security_1.generateCompare)({
            plainText: OTP,
            hashedText: OTPstore
        });
        if (!compareOTP) {
            throw new exceptions_1.NotFoundException("OTP is not match");
        }
        user.confirmEmail = true;
        await user.save();
        return {
            message: "Email confirmed successfully"
        };
    }
    async ResendconfirmedEmail(email) {
        const user = await this._userRepository.findOne({
            filter: { email }
        });
        if (!user) {
            throw new exceptions_1.NotFoundException("User not found");
        }
        if (user.confirmEmail) {
            throw new exceptions_1.BadRequestException("Email already confirmed");
        }
        await this._emailsevice.sendEmailOTP({
            email,
            emailType: email_enums_1.EmailTypeEnum.confirmEmail,
            subject: "Verify Your Email"
        });
        return {
            message: "Verification email sent successfully"
        };
    }
    async sendOTPforgetPassword(email) {
        const user = await this._userRepository.findOne({
            filter: { email }
        });
        if (!user) {
            return;
        }
        if (!user.confirmEmail) {
            throw new exceptions_1.BadRequestException("You must confirm your email before resetting your password");
        }
        await this._emailsevice.sendEmailOTP({
            email,
            emailType: email_enums_1.EmailTypeEnum.forgetPassword,
            subject: "Reset Your Password"
        });
        return {
            message: "Password reset OTP sent successfully"
        };
    }
    async ResendForgetPasswordEmail(email) {
        await this._emailsevice.sendEmailOTP({
            email,
            emailType: email_enums_1.EmailTypeEnum.forgetPassword,
            subject: "Reset Your Password"
        });
        return {
            message: "Password reset OTP sent successfully"
        };
    }
    async verifyOTPforgetPassword(bodyData) {
        const { email, OTP } = bodyData;
        const key = this._redisMethod.getOTPkey({
            email,
            emailType: email_enums_1.EmailTypeEnum.forgetPassword
        });
        const emailOTP = await this._redisMethod.get(key);
        if (!emailOTP) {
            throw new exceptions_1.BadRequestException("Invalid OTP or OTP expired");
        }
        const compareOTP = await (0, security_1.generateCompare)({
            plainText: OTP,
            hashedText: emailOTP
        });
        if (!compareOTP) {
            throw new exceptions_1.NotFoundException("OTP is not match");
        }
        return {
            message: "password reset successfully"
        };
    }
    async resetPassword(bodyData) {
        const { email, password, OTP } = bodyData;
        await this.verifyOTPforgetPassword({ email, OTP });
        await this._userRepository.updateOne({
            filter: { email },
            update: {
                password: await (0, security_1.generateHash)({
                    plainText: password
                })
            }
        });
        return {
            message: "Password reset successfully"
        };
    }
    async verifyIdToken(idToken) {
        const client = new google_auth_library_1.OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: '623784589660-go8pk1hqu6j7autdvekil6fatkkj740d.apps.googleusercontent.com'
        });
        return ticket.getPayload();
    }
    async signupwithgmail(idToken) {
        const payloadTokenVerify = await this.verifyIdToken(idToken);
        if (!payloadTokenVerify) {
            throw new exceptions_1.BadRequestException("Payload is not defined");
        }
        if (!payloadTokenVerify.email_verified) {
            throw new exceptions_1.BadRequestException("Email is not verified");
        }
        const user = await this._userRepository.findOne({
            filter: {
                email: payloadTokenVerify.email
            }
        });
        if (user) {
            console.log("LOGIN");
            if (user.provider !== enums_1.ProviderEnum.GOOGLE) {
                throw new exceptions_1.ConfilectException("User already exists");
            }
            return {
                status: 200,
                result: await this.loginwithGmail(idToken)
            };
        }
        const newUser = await this._userRepository.createOne({
            data: {
                email: payloadTokenVerify.email,
                profilPic: payloadTokenVerify.picture,
                username: payloadTokenVerify.name,
                provider: enums_1.ProviderEnum.GOOGLE,
                confirmEmail: true
            }
        });
        return {
            status: 201,
            result: await this._tokenService.generateToken(newUser)
        };
    }
    async loginwithGmail(idToken) {
        const payload = await this.verifyIdToken(idToken);
        if (!payload) {
            throw new exceptions_1.BadRequestException("email is not defined");
        }
        if (!payload.email_verified) {
            throw new exceptions_1.BadRequestException("email is not verified");
        }
        const user = await this._userRepository.findOne({
            filter: {
                email: payload.email,
                provider: enums_1.ProviderEnum.GOOGLE
            }
        });
        console.log(user);
        return this._tokenService.generateToken(user);
    }
}
exports.default = new AuthService();
