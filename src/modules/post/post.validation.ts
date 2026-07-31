import z from "zod";
import { postPrivacyEnum } from "../../common/enums/postPrivacy.Enum";
import { Types } from "mongoose";


export const createPostSchema={
    body:z.object({ 
        content:z.string().min(3).max(1000).optional(),
         files:z.array(z.any()).optional(),
        tags:z.array(z.string()).optional(),
        privacy:z.coerce.number().default(postPrivacyEnum.public)
    }).superRefine((args,crx)=>{
      if(args.files?.length&& !args.content){
          crx.addIssue({
            code:"custom",
            path:["content"],
            message:"you should add content at least or upload files"
          })
      }
      for(const tag of args.tags as string[]){
        if(!Types.ObjectId.isValid(tag)){
            crx.addIssue({
            code:"custom",
            path:["tags"],
            message:`invalid tag object ${tag}`
          })
        }
      }
      const uniqueTags=[...new Set(args.tags)]

      if(uniqueTags.length != args.tags?.length){
        crx.addIssue({
          code:"custom",
          path:["tags"],
          message:"tags must be unique"
        })
      }

    }),
   
}
export const updatePostSchema={
    body:z.object({ 
        content:z.string().min(3).max(1000).optional(),
         files:z.array(z.any()).optional(),
         removeFiles:z.array(z.string().refine((value)=>{
          return Types.ObjectId.isValid(value)
        },"invalid tag format")).optional(),
        tags:z.array(z.string()).optional(),
         removeTag:z.array(z.string().refine((value)=>{
          return Types.ObjectId.isValid(value)
        },"invalid tag format")).optional(),
        privacy:z.number().optional()
    }).superRefine((args,crx)=>{
    
      for(const tag of args.tags as string[]){
        if(!Types.ObjectId.isValid(tag)){
            crx.addIssue({
            code:"custom",
            path:["tags"],
            message:`invalid tag object ${tag}`
          })
        }
      }
      const uniqueTags=[...new Set(args.tags)]

      if(uniqueTags.length != args.tags?.length){
        crx.addIssue({
          code:"custom",
          path:["tags"],
          message:"tags must be unique"
        })
      }

    }),
    
    params:z.object({
      postId:z.string().refine((value)=>{
          return Types.ObjectId.isValid(value)
        },"invalid tag format")
    })
}


