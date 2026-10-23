import { ProviderEnum } from '../../common/enums';
import { EmailTypeEnum } from '../../common/enums/email.enums';
import {
    BadRequestException,
    ConfilectException,
    NotFoundException
} from '../../common/exceptions';
import { IUser } from '../../common/interfaces';
import rediseService from '../../common/service/redise.service';
import emailService from '../../common/utils/email/email.service';
import NotificationService from '../../common/utils/Notification/Notification.service';
import { generateCompare, generateHash } from '../../common/utils/security';
import tokenService from '../../common/utils/security/token.service';
import userRepository from '../../DB/DB.Repository/user.repo';
import { confirmEmailDto, LoginDto, SignupDto } from './auth.dto';
import { OAuth2Client } from 'google-auth-library';

class AuthService {
    private _userRepository = userRepository;
    private _tokenService = tokenService;
    private _emailsevice = emailService;
    private _redisMethod = rediseService;
    private _notificationService = NotificationService;

    public async login(bodyData: LoginDto) {
        const { email, password } = bodyData;

        const user = await this._userRepository.findOne({
            filter: { email }
        });

        if (!user) {
            throw new NotFoundException("invalid info");
        }

        const ispasswordvalid = await generateCompare({
            plainText: password,
            hashedText: user.password
        });

        if (!ispasswordvalid) {
            throw new NotFoundException("invalid info");
        }

        if (!user.confirmEmail) {
            throw new BadRequestException("Please confirm your email");
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

        const { accessToken, refreshtoken } =
            this._tokenService.generateToken(user);

        return { accessToken, refreshtoken };
    }

    public async signup(data: SignupDto): Promise<any> {
        console.log("SIGNUP: Started");

        const userExist = await this._userRepository.findOne({
            filter: { email: data.email }
        });

        if (userExist) {
            throw new ConfilectException("User already exists");
        }

        // Create the account as unconfirmed.
        const user = await this._userRepository.createOne({
            data: {
                ...data,
                password: await generateHash({
                    plainText: data.password
                }),
                confirmEmail: false
            }
        });

        console.log("SIGNUP: User created:", user.email);
        console.log("SIGNUP: Sending confirmation OTP...");

        // Send the confirmation OTP to the user's email.
        await this._emailsevice.sendEmailOTP({
            email: user.email,
            emailType: EmailTypeEnum.confirmEmail,
            subject: "Verify Your Email"
        });

        console.log("SIGNUP: Confirmation email request completed");

        return {
            message: "Account created. Please check your email for the verification code.",
            email: user.email
        };
    }

    public async confirmedEmail(bodyData: confirmEmailDto) {
        const { email, OTP } = bodyData;

        const user = await this._userRepository.findOne({
            filter: { email }
        });

        if (!user) {
            throw new NotFoundException("invalid info");
        }

        if (user.confirmEmail) {
            throw new BadRequestException("Email already confirmed");
        }

        const OTPkey = this._redisMethod.getOTPkey({
            email,
            emailType: EmailTypeEnum.confirmEmail
        });

        const OTPstore = await this._redisMethod.get(OTPkey);

        if (!OTPstore) {
            throw new NotFoundException("invalid OTP");
        }

        const compareOTP = await generateCompare({
            plainText: OTP,
            hashedText: OTPstore
        });

        if (!compareOTP) {
            throw new NotFoundException("OTP is not match");
        }

        user.confirmEmail = true;
        await user.save();

        return {
            message: "Email confirmed successfully"
        };
    }

    public async ResendconfirmedEmail(email: string) {
        const user = await this._userRepository.findOne({
            filter: { email }
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (user.confirmEmail) {
            throw new BadRequestException("Email already confirmed");
        }

        await this._emailsevice.sendEmailOTP({
            email,
            emailType: EmailTypeEnum.confirmEmail,
            subject: "Verify Your Email"
        });

        return {
            message: "Verification email sent successfully"
        };
    }

    public async sendOTPforgetPassword(email: string) {
        const user = await this._userRepository.findOne({
            filter: { email }
        });

        if (!user) {
            return;
        }

        if (!user.confirmEmail) {
            throw new BadRequestException(
                "You must confirm your email before resetting your password"
            );
        }

        await this._emailsevice.sendEmailOTP({
            email,
            emailType: EmailTypeEnum.forgetPassword,
            subject: "Reset Your Password"
        });

        return {
            message: "Password reset OTP sent successfully"
        };
    }

    public async ResendForgetPasswordEmail(email: string) {
        await this._emailsevice.sendEmailOTP({
            email,
            emailType: EmailTypeEnum.forgetPassword,
            subject: "Reset Your Password"
        });

        return {
            message: "Password reset OTP sent successfully"
        };
    }

    public async verifyOTPforgetPassword(bodyData: any) {
        const { email, OTP } = bodyData;

        const key = this._redisMethod.getOTPkey({
            email,
            emailType: EmailTypeEnum.forgetPassword
        });

        const emailOTP = await this._redisMethod.get(key);

        if (!emailOTP) {
            throw new BadRequestException("Invalid OTP or OTP expired");
        }

        const compareOTP = await generateCompare({
            plainText: OTP,
            hashedText: emailOTP
        });

        if (!compareOTP) {
            throw new NotFoundException("OTP is not match");
        }

        return {
            message: "password reset successfully"
        };
    }

    public async resetPassword(bodyData: any) {
        const { email, password, OTP } = bodyData;

        await this.verifyOTPforgetPassword({ email, OTP });

        await this._userRepository.updateOne({
            filter: { email },
            update: {
                password: await generateHash({
                    plainText: password
                })
            }
        });

        return {
            message: "Password reset successfully"
        };
    }

    public async verifyIdToken(idToken: string) {
        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken,
            audience: '623784589660-go8pk1hqu6j7autdvekil6fatkkj740d.apps.googleusercontent.com'
        });

        return ticket.getPayload();
    }

    public async signupwithgmail(
        idToken: string
    ): Promise<{
        status: number;
        result: {
            accessToken: string;
            refreshtoken: string;
        };
    }> {
        const payloadTokenVerify = await this.verifyIdToken(idToken);

        if (!payloadTokenVerify) {
            throw new BadRequestException("Payload is not defined");
        }

        if (!payloadTokenVerify.email_verified) {
            throw new BadRequestException("Email is not verified");
        }

        const user = await this._userRepository.findOne({
            filter: {
                email: payloadTokenVerify.email as string
            }
        });

        if (user) {
            console.log("LOGIN");

            if (user.provider !== ProviderEnum.GOOGLE) {
                throw new ConfilectException("User already exists");
            }

            return {
                status: 200,
                result: await this.loginwithGmail(idToken)
            };
        }

        const newUser = await this._userRepository.createOne({
            data: {
                email: payloadTokenVerify.email as string,
                profilPic: payloadTokenVerify.picture,
                username: payloadTokenVerify.name,
                provider: ProviderEnum.GOOGLE,
                confirmEmail: true
            }
        });

        return {
            status: 201,
            result: await this._tokenService.generateToken(newUser!)
        };
    }

    public async loginwithGmail(
        idToken: string
    ): Promise<{
        accessToken: string;
        refreshtoken: string;
    }> {
        const payload = await this.verifyIdToken(idToken);

        if (!payload) {
            throw new BadRequestException("email is not defined");
        }

        if (!payload.email_verified) {
            throw new BadRequestException("email is not verified");
        }

        const user = await this._userRepository.findOne({
            filter: {
                email: payload.email as string,
                provider: ProviderEnum.GOOGLE
            }
        });

        console.log(user);

        return this._tokenService.generateToken(user as IUser);
    }
}

export default new AuthService();

