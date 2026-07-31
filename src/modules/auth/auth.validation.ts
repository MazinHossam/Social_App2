import {z} from 'zod'
import { generalVlaidation } from '../../common/Validation'

export const login={
    body:z.object({

        email:generalVlaidation.email,
        password:generalVlaidation.password,
        FCM:z.string().optional()
 
    })
} 
export const signup ={
    body:login.body.safeExtend({
        username:generalVlaidation.username,
       confirmPassword:generalVlaidation.confirmPassword,
       phone:generalVlaidation.phone,
       gender:generalVlaidation.gender.optional()

    }).refine((data)=>{
        return data.password===data.confirmPassword
    },{error:"Password mismatch with confirm password"}),

  
}

export const confirmEmailV = {
    body:z.object({
        email: generalVlaidation.email,
        OTP: generalVlaidation.OTP
    })
}
export const resendConfirmEmailV = {
    body:z.object({
        email: generalVlaidation.email,
    
    })
}
export const sendOTPForgetPasswordV = {
    body:z.object({
        email: generalVlaidation.email,
    
    })
}
export const ResendOTPForgetPasswordV = {
    body:z.object({
        email: generalVlaidation.email,
    
    })
}
export const VerifyOTPForgetPasswordV = {
    body:z.object({
        email: generalVlaidation.email,
        OTP: generalVlaidation.OTP
    })
}
export const ResetPasswordV = {
    body:z.object({
        email: generalVlaidation.email,
        OTP: generalVlaidation.OTP,
        password: generalVlaidation.password
    })
}
export const signupWithGmailV = {
    body:z.object({
        idToken: z.string()
    })
}