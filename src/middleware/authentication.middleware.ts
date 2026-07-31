
import { JwtPayload } from 'jsonwebtoken';
import { BadRequestException, NotFoundException, UnauthorizedException } from '../common/exceptions';
import tokenService from '../common/utils/security/token.service';

import { NextFunction, Request,Response } from "express";
import { RoleEnum } from '../common/enums';
import rediseService from '../common/service/redise.service';
import userRepo from '../DB/DB.Repository/user.repo';


export  function  authenticateToken(){
 return async(req:Request,res:Response,next:NextFunction)=>{
const token = req.headers.authorization;
   if(!token){
       throw new BadRequestException('Token is required');
   }
      const decoded = tokenService.decodeToken( token ) as JwtPayload;
      // console.log(decoded);
        if(!decoded || !decoded.aud){
       throw new BadRequestException('Invalid token');
   }
    const [userRole,TokenType] = decoded.aud;
    if(TokenType != 'access'){
        throw new BadRequestException('Invalid token type');
    }
          const {accessTokensignature} = tokenService.getSignature(Number(userRole) as RoleEnum);
      

      const verified = tokenService.verifyToken({ token, signature: accessTokensignature }) as JwtPayload;

   if (await rediseService.get( `blackList::${verified.sub}::${verified.jti}`)) {
   throw new UnauthorizedException('You Need to Login Again');
   }

   if (!verified.sub) {
  throw new BadRequestException("Invalid token");
}

      const user = await userRepo.findById({ _id: verified.sub });
      if(!user){
        throw new  NotFoundException('User not found');
      }
      if (new Date(verified.iat! *1000) < user.changeCredentialsTime!) {
throw new UnauthorizedException('You Need to Login Again');
      }

  
    req.user = user;
    req.payloadToken=verified

       return next();
}
}


export const autholaitaion = (roles=RoleEnum.USER) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== roles) {
      throw new BadRequestException('Unauthorized');
    }
    return next();
  };
};