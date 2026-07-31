import {z} from 'zod'

export const generalVlaidation={
           email:z.email(),
        password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/,{error:"weak password"}),
        username:z.string({error:"username is required"}).min(2,{error:"min is 2 char"}).max(20,{error:"max is 20 char"}),
       confirmPassword:z.string(),
       phone:z.string().regex(/^01[0125]\d{8}$/, {error:"invalid phone number"}),
       gender:z.string().optional(),
       OTP:z.string().length(6).regex(new RegExp(/^\d+$/))
}

