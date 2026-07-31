import { Router } from "express";
import { authenticateToken } from "../../middleware/authentication.middleware";
import { successResponce } from "../../common/success.responce/success.responce";
import userService from "./user.service";
import { Validation } from "../../middleware";
import { logOutSchema } from "./user.Validation";
import { cloudFileUpload, fileValidation } from "../../common/utils/multer/cloud.multer";


const userController =Router()

userController.get("/", authenticateToken(), (req, res) => {

  
    return successResponce<any>({res,status:201,data:req.user})
});


userController.post('/logOut',authenticateToken(),Validation(logOutSchema),async (req,res)=>{

 
    const data =await userService.logout(req.user._id,req.payloadToken,req.body.logoutOptions)
    console.log(data)
    return successResponce({res,status:201,data: "User logged out successfully"})
}) 

userController.patch(
  "/profile-image",authenticateToken(),
  cloudFileUpload({ validation: fileValidation.image }).single("image"),
  async (req, res) => {
const result = await userService.profileImage(req.file!.path,req.user);


return successResponce({
    res,
    status: 201,
    data: result
});
  }
);
export default userController 