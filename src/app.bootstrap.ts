
import express from 'express'
import  type { NextFunction, Request, Response } from 'express'
import { authRouter } from './modules'
import { globalErrorHandler } from './middleware'

import { PORT } from './config/config'
import connectDB from './DB/DB.connection'
import { connectRedies } from './DB/DB.Repository'
import userController from './modules/user/user.controller'
import cors from 'cors'
// import NotificationService from './common/utils/Notification/Notification.service'
import postController from './modules/post/post.controller'



const bootstrap=async():Promise<void>=>{
    const app:express.Express =express()
    app.use(express.json())
    app.use(cors())
 
app.get("/",(req:Request,res:Response,next:NextFunction)=>{
res.json("welcome to my landing page")
})
await connectDB()
await  connectRedies() 
// const user= await UserModel.create({
//     "username":"John Doe",
//     "email":"johndowwwwsssss22e2222221222@gmail.com",
//     "password":"Hashedpassword@1",
//     "passwordConfirm":"Hashedpassword@1"
// })
// user.username="mazin hossam"
// await user.save()


app.use("/auth",authRouter) 
app.use("/user",userController)
app.use("/post",postController)
app.use(globalErrorHandler)

// app.post("/SendNotification", async (req, res) => {
//     try {
//         const { token, title, body } = req.body;

//         await NotificationService.sendNotification(token, title, body);

//         res.json({
//             message: "Notification Sent"
//         });
 
//     } catch (err) {
//         console.error(err);
//         res.status(500).json(err);
//     }
// });

app.get("/*dummy",(req,res,next)=>{
res.status(404).json("invalid page errorrrrrrrr")
})




    app.listen(PORT,()=>{
console.log(`server is running on port  ${PORT}`);
    })

  
 

     
}
  
export default bootstrap 