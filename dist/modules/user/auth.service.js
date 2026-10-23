"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_enums_1 = require("../../common/enums/email.enums");
const exceptions_1 = require("../../common/exceptions");
const redise_service_1 = __importDefault(require("../../common/service/redise.service"));
const email_service_1 = __importDefault(require("../../common/utils/email/email.service"));
const security_1 = require("../../common/utils/security");
const token_service_1 = __importDefault(require("../../common/utils/security/token.service"));
const user_repo_1 = __importDefault(require("../../DB/DB.Repository/user.repo"));
class AuthService {
    _userRepository = user_repo_1.default;
    _tokenService = token_service_1.default;
    _emailsevice = email_service_1.default;
    _redisMethod = redise_service_1.default;
    async login(bodyData) {
        const { email, password } = bodyData;
        const user = await this._userRepository.findOne({ filter: { email } });
        if (!user) {
            throw new exceptions_1.NotFoundException("invalid info");
        }
        const ispasswordvalid = await (0, security_1.generateCompare)({ plainText: password, hashedText: user.password });
        if (!ispasswordvalid) {
            throw new exceptions_1.NotFoundException("invalid info");
        }
        if (!user.confirmEmail) {
            throw new exceptions_1.BadRequestException("Please confirm your email");
        }
        const { accessToken, refreshtoken } = this._tokenService.generateToken(user);
        return { accessToken, refreshtoken };
    }
    async signup(data) {
        const userExist = await this._userRepository.findOne({ filter: { email: data.email } });
        if (userExist)
            throw new exceptions_1.ConfilectException("User already exists");
        const user = await this._userRepository.createOne({ data: { email: data.email, password: await (0, security_1.generateHash)({ plainText: data.password }), username: data.username } });
        await this._emailsevice.sendEmailOTP({
            email: user.email,
            emailType: email_enums_1.EmailTypeEnum.confirmEmail,
            subject: "Verify Your Email"
        });
        return user;
    }
    async confirmedEmail(bodyData) {
        const { email, OTP } = bodyData;
        const user = await this._userRepository.findOne({ filter: { email } });
        if (!user) {
            throw new exceptions_1.NotFoundException("invalid info");
        }
        if (user.confirmEmail) {
            throw new exceptions_1.BadRequestException("Email already confirmed");
        }
        const OTPstore = await this._redisMethod.get(this._redisMethod.getOTPkey({ email, emailType: email_enums_1.EmailTypeEnum.confirmEmail }));
        if (!OTPstore) {
            throw new exceptions_1.NotFoundException("invalid OTP");
        }
        console.log("OTP from user:", OTP);
        console.log("OTP from redis:", OTPstore);
        const compareOTP = await (0, security_1.generateCompare)({ plainText: OTP, hashedText: OTPstore });
        if (!compareOTP) {
            throw new exceptions_1.NotFoundException("OTP is not match");
        }
        user.confirmEmail = true;
        await user.save();
        return { message: "Email confirmed successfully" };
    }
    async ResendconfirmedEmail(email) {
        await this._emailsevice.sendEmailOTP({ email, emailType: email_enums_1.EmailTypeEnum.confirmEmail, subject: "Verify Your Email" });
    }
}
exports.default = new AuthService();
