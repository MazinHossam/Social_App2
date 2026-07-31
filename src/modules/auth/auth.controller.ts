import { Router } from "express";
import type {NextFunction, Request,Response} from "express"
import authService from "./auth.service";
import * as Validators from './auth.validation'
// import { BadRequestException } from "../../common/exceptions";
import { successResponce } from "../../common/success.responce/success.responce";
import { Validation } from "../../middleware";
import { confirmEmailV, resendConfirmEmailV } from "./auth.validation";




const router =Router()
router.post(
    '/signup',
  Validation(Validators.signup) ,
    async(req:Request,res:Response,next:NextFunction):Promise<Response>=>{


const data=await authService.signup(req.body)
    return successResponce<any>({res,status:201,data})
})



router.post(
    '/login',
  Validation(Validators.login) ,
   async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{


const resulte =await authService.login(req.body)
console.log(resulte)
    return successResponce<{
    accessToken: string;
    refreshtoken: string;
    }>({res,status:200,data:resulte})
})

router.post("/confirm-email", Validation(confirmEmailV),
 async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{

    const result = await authService.confirmedEmail(req.body)
    return successResponce({res,status:200,data:result,message:"Email confirmed successfully"})
})

router.post("/resend-OTP-email", Validation(resendConfirmEmailV), async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{

    const result = await authService.ResendconfirmedEmail(req.body.email)
    return successResponce({res,status:200,data:result,message:"OTP resent successfully"})
})



router.post("/send-OTP-forget-password", Validation(Validators.sendOTPForgetPasswordV), async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{

    const result = await authService.sendOTPforgetPassword(req.body.email)
    return successResponce({res,status:200,data:result,message:"OTP sent successfully"})
})
router.post("/Resend-OTP-forget-password", Validation(Validators.ResendOTPForgetPasswordV), async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{

    const result = await authService.ResendForgetPasswordEmail(req.body.email)
    return successResponce({res,status:200,data:result,message:"OTP sent successfully"})
})
router.post("/Verify-OTP-forget-password", Validation(Validators.VerifyOTPForgetPasswordV), async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{

    const result = await authService.verifyOTPforgetPassword(req.body)
    return successResponce({res,status:200,data:result,message:"OTP verified successfully"})
})

router.post("/Reset-password", Validation(Validators.ResetPasswordV), async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{

    const result = await authService.resetPassword(req.body)
    return successResponce({res,status:200,data:result,message:"Password reset successfully"})
})
router.post("/signup/gmail", Validation(Validators.signupWithGmailV), async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{

    const result = await authService.signupwithgmail(req.body.idToken)
    console.log(result);
    return successResponce<{
   status:number;
    result:{
     
    accessToken:string,
    refreshtoken:string
    }
    }>({res,data:result})
})









export default router