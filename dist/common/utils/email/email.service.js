"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config/config");
const exceptions_1 = require("../../exceptions");
const redise_service_1 = __importDefault(require("../../service/redise.service"));
const opt_1 = require("../opt");
const security_1 = require("../security");
const Temblete_email_1 = require("../Temblete.email");
const email_send_1 = require("./email.send");
class EmailService {
    _redisMethod = redise_service_1.default;
    constructor() { }
    async sendEmailOTP({ email, emailType, subject }) {
        const OPTttl = await this._redisMethod.ttl(this._redisMethod.getOTPkey({ email, emailType }));
        if (OPTttl > 0) {
            throw new exceptions_1.BadRequestException(`Please wait ${OPTttl} seconds before requesting a new OTP`);
        }
        const isBlocked = await this._redisMethod.exists(this._redisMethod.getOTPBlocekdkey({ email, emailType }));
        console.log(isBlocked);
        if (isBlocked) {
            throw new exceptions_1.BadRequestException(`Try again later`);
        }
        console.log("isBlocked =", isBlocked);
        const reqNo = await this._redisMethod.get(this._redisMethod.getOTPReqNokey({ email, emailType }));
        console.log("reqNo =", reqNo);
        if (Number(reqNo) == 5) {
            await this._redisMethod.set({
                key: this._redisMethod.getOTPBlocekdkey({ email, emailType }),
                value: 1,
                exValue: 60 * 10
            });
            throw new exceptions_1.BadRequestException(`you can request a new OTP after 10m seconds`);
        }
        const codeOTP = (0, opt_1.generateOTP)();
        await (0, email_send_1.SendEmail)({
            to: email,
            html: (0, Temblete_email_1.TambleteEmail)(codeOTP),
            subject
        });
        const hashedOTP = await (0, security_1.generateHash)({ plainText: codeOTP.toString(), salt: config_1.SALT_ROUND });
        await this._redisMethod.set({
            key: this._redisMethod.getOTPkey({ email, emailType }),
            value: String(hashedOTP),
            exType: "EX",
            exValue: 60 * 2
        });
        await this._redisMethod.incr(this._redisMethod.getOTPReqNokey({ email, emailType }));
        return { message: "check your email for the OTP" };
    }
}
exports.default = new EmailService();
