import { generateHash } from './../../common/utils/security/hash.security';
import { Document, model, models, Schema, Types } from "mongoose";
import { IUser } from "../../common/interfaces";
import { GenderEnum,RoleEnum,ProviderEnum } from "../../common/enums";
import emailService from '../../common/utils/email/email.service';
import { EmailTypeEnum } from '../../common/enums/email.enums';







const userSchema = new Schema<IUser>({

    firstName:{ type: String, required: true },
    lastName:{ type: String, required: true },
    email:{ type: String, required: true, unique: true },
    password:{type:String, required:function (this){
        return this.provider===ProviderEnum.SYSTEM
    } 
},
    phone:{ type: String },
    profilPic:{secure_url:String,public_id:String},
    profileCoverPictures: {secure_url:String,public_id:String} ,
    friends:[{type: Types.ObjectId, ref: "User" }],


    gender:{ type: Number, enum: GenderEnum,default: GenderEnum.SYSTEM },
    role:{ type: Number, enum: RoleEnum, default: RoleEnum.USER },
    provider:{ type: Number, enum: ProviderEnum, default: ProviderEnum.SYSTEM },

    changeCredentialsTime:{type:Date},
    DOB:{type:Date},
    confirmEmail:{type:Boolean, default:false},
 

},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    collection:"SOCIAL_APP_USERS"
});
userSchema.pre("save", async function(this: Document & IUser & { wasNew: boolean }){

this.wasNew=this.isNew;


if(this.isModified("password")){
this.password=await generateHash({ plainText: this.password })
   
}
   
})
userSchema.post("save", async function(this:  Document & IUser & { wasNew: boolean }){


try{
     if(this.wasNew){
         await emailService.sendEmailOTP({
            email: this.email,
            emailType: EmailTypeEnum.confirmEmail,
            subject: "Verify Your Email"
        })
     }
}catch(error){
    console.error("Error occurred while saving user:", error);
}
})

userSchema.virtual("username").set(function(value:string){
    const [firstName, lastName] = value.split(' ')|| []
    this.firstName=firstName as string;
    this.lastName=lastName as string;
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})

export const UserModel=models.user || model<IUser>("User", userSchema);