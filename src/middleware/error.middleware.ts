import type{ NextFunction, Request, Response } from "express";
interface Ierror extends Error{
    statusCode:number
}
export const globalErrorHandler=(error:Ierror,req:Request,res:Response,next:NextFunction)=>{


const status = error.statusCode || 500

return res.status(status).json({
    massage:error.message || "internal server error"
    ,cause:error.cause,
    stack:error.stack,
    error
})
}