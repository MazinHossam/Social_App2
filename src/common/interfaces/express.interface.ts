import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";

 
 declare module "express-serve-static-core"{
       interface Request {
           user: IUser;
           payloadToken:JwtPayload
       
       }
 }