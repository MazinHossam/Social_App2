import { IUser } from './../../interfaces/user.interface';
  import { TOKEN_KEY_ADMIN, TOKEN_KEY_ADMIN_REFRESH, TOKEN_KEY_USER, TOKEN_KEY_USER_REFRESH } from "../../../config/config"
import { RoleEnum } from "../../enums/User.enums"
import jwt, { SignOptions } from "jsonwebtoken"
import { randomUUID } from 'crypto'
import { TokenType } from '../../enums/token.enum';



class TokenService{

  
 getSignature(role : RoleEnum = RoleEnum.USER):{ accessTokensignature: string; refreshSignature: string } {
   let accessTokensignature = ""
   let refreshSignature = ""
   switch (role) {
      case RoleEnum.USER:
         accessTokensignature = TOKEN_KEY_USER ?? ''
         refreshSignature = TOKEN_KEY_USER_REFRESH ?? ''
         break;
      case RoleEnum.ADMIN:
         accessTokensignature = TOKEN_KEY_ADMIN ?? ''
         refreshSignature = TOKEN_KEY_ADMIN_REFRESH ?? ''
         break;
   }

   return { accessTokensignature, refreshSignature }

}

   createToken({ payload = {}, signature, options = {} }:{
      payload?: string | object;
      signature:string;
      options?:SignOptions;
    }) {
   return jwt.sign(payload, signature, options);
       }


    generateToken(user:IUser) {
   const { accessTokensignature, refreshSignature } = this.getSignature(user.role);
   const tokenId = randomUUID()
   const accessToken = this.createToken({
      signature: accessTokensignature,
      options: {
         audience: [String(user.role), TokenType.access],
         expiresIn: 60 * 15,
         subject: user._id.toString(),
         jwtid: tokenId
      }
   })

   const refreshtoken = this.createToken({
      signature: refreshSignature,
      options: {
         audience: [String(user.role), TokenType.refresh],
         expiresIn: '1y',
         subject: user._id.toString(),
         jwtid: tokenId
      }
   })
   return { accessToken, refreshtoken }
}



 
   verifyToken({ token, signature }:{ token: string; signature: string }) {
   return jwt.verify(token, signature)
}

   decodeToken(token: string) {
   //   console.log({ changCredentialsTime: user.changCredentialsTime?.getTime(), iat: decodeToken(user.iat) })
   return jwt.decode(token)

}


}

export default new TokenService()