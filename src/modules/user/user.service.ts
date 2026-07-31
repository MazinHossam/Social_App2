import { JwtPayload } from "jsonwebtoken"
import { Types } from "mongoose"
import rediseService from "../../common/service/redise.service"
import  userRepository  from '../../DB/DB.Repository/user.repo';

import configureCloudinary from "../../common/utils/multer/clodinary";





class UserService{
    private _redisMethod=rediseService
    private _userRepository=userRepository



public async logout(userId : string | Types.ObjectId, tokenData: JwtPayload, logoutOptions: string){
if(logoutOptions=="all"){
  await this._userRepository.updateOne({

    filter: {_id:userId},
    update: { changeCredentialsTime: Date.now() }
  })
  return 
}else{

   await this._redisMethod.set({
    key:this._redisMethod.getblackList({
        userId: userId as string,
        tokenId: tokenData.jti || ""
    }),
    value: tokenData.jti as string,
    exValue:(60*60*24*365) - (Date.now()/1000 - tokenData.iat!)
   })

}
}





public async profileImage(path: string,user:any){

const {secure_url,public_id}=await configureCloudinary().uploader.upload(path,{
  folder:`${process.env.APP_NAME}/users/${user._id}`
})
const userprofile=await this._userRepository.findOne({ filter: { _id: user._id } })
if(userprofile){
  await this._userRepository.updateOne({
    filter: { _id: user._id },
    update: { profilPic: { secure_url, public_id } },
    options: { upsert: false }
  })
  if(userprofile?.profilPic?.public_id){
    await configureCloudinary().uploader.destroy(userprofile.profilPic.public_id)
  }
}
return userprofile;
}    
}









export default new UserService()