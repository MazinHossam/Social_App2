
import { NextFunction, Request, Response } from "express"
import { BadRequestException } from '../common/exceptions';
import { ZodType } from "zod";

type KeyReqType=keyof Request
type ShemaType=Partial<Record<KeyReqType,ZodType>>
type IssuesType={
            key:KeyReqType,
            issues:{
                message:string,
                path:(symbol|number|string|undefined|null)[]
            }[]
        }[]
export const Validation=(schema:ShemaType, filesifbody=false)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        console.log(Object.keys(schema))
        const issues:IssuesType= []
    for (const key of Object.keys(schema)as  KeyReqType[]) {
        if(!schema[key]){
continue
        }
        if(key==="body" && filesifbody == true){
            req.body.files = req.files
        }
        const validationResult=schema[key].safeParse(req[key])
        if(!validationResult.success){
          issues.push({key,issues:validationResult.error.issues.map(issue=>{return{path:issue.path,message:issue.message}})})
        }
    }
    if(issues.length){
        throw new BadRequestException("Validation Error",{issues})
    }
    next()
    }

}