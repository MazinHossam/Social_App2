import { Types } from "mongoose";
import { ProviderEnum,GenderEnum,RoleEnum } from "../enums";

export interface IUser {
    _id: any;
    friends?:Types.ObjectId[];

    firstName:string;
    lastName:string;
    username?:string;
    password:string;
    phone?:string;
    email:string;
    profilPic?:{ secure_url: string; public_id: string };
    profileCoverPictures?:{ secure_url: string; public_id: string }[];


    gender:GenderEnum;
    role:RoleEnum;
    provider:ProviderEnum;

    changeCredentialsTime?:Date;
    DOB?:Date;
    confirmEmail?:boolean;

    createdAt?:Date;
    updatedAt?:Date

}

