import { SALT_ROUND } from "../../../config/config"
import { EmailTypeEnum } from "../../enums/email.enums"
import { BadRequestException } from "../../exceptions"
import rediseService from "../../service/redise.service"
import { generateOTP } from "../opt"
import { generateHash } from "../security"
import { TambleteEmail } from "../Temblete.email"
import { SendEmail } from "./email.send"


class EmailService {
    private _redisMethod=rediseService
    constructor(){}
    async  sendEmailOTP({email,emailType,subject}:{email: string, emailType: EmailTypeEnum, subject: string}) {
    const OPTttl = await this._redisMethod.ttl(this._redisMethod.getOTPkey({email,emailType}))
    if (OPTttl > 0) {
        throw new BadRequestException(`Please wait ${OPTttl} seconds before requesting a new OTP`)
    }

    const isBlocked = await this._redisMethod.exists(this._redisMethod.getOTPBlocekdkey({email,emailType}))
    console.log(isBlocked);
    if (isBlocked) {
        throw new BadRequestException(`Try again later`)
    }
    console.log("isBlocked =", isBlocked);
    const reqNo = await this._redisMethod.get(this._redisMethod.getOTPReqNokey({email,emailType}))
    console.log("reqNo =", reqNo);
    if (Number(reqNo) == 5) {

        await this._redisMethod.set({
            key: this._redisMethod.getOTPBlocekdkey({email,emailType}),
            value: 1,
            exValue: 60 * 10 // 5 minutes
        })
        throw new BadRequestException(`you can request a new OTP after 10m seconds`)
    }

    const codeOTP = generateOTP()

    await SendEmail({
        to: email,
        html: TambleteEmail(codeOTP),
        subject

    })
    const hashedOTP = await generateHash({ plainText: codeOTP.toString(), salt: SALT_ROUND })
    await this._redisMethod.set({
        key: this._redisMethod.getOTPkey({email,emailType}),
        value: String(hashedOTP),
        exType: "EX",
        exValue: 60 * 2 // 5 minutes
    })

    await this._redisMethod.incr(this._redisMethod.getOTPReqNokey({email,emailType}))
    return { message: "check your email for the OTP" }

}
}

export default new EmailService()