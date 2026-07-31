import { HydratedDocument, model, models, Schema, Types } from "mongoose";
import { postPrivacyEnum } from "../../common/enums/postPrivacy.Enum";



export interface IPost {
    content?:string;
    attachment?: {
    secure_url: string;
    public_id: string;
}[];
    likes?:Types.ObjectId[];
    tags?:Types.ObjectId[];
    privacy:postPrivacyEnum;
    createdBy:Types.ObjectId;

    changeCredentialsTime?:Date;


}

export type HIPost=HydratedDocument<IPost>


const postSchema= new Schema<IPost>({
    content:{ type: String,required:function():boolean{
        return !this.attachment?.length
    } },
    attachment:{ type: [{ secure_url: String, public_id: String }] },
    likes:{ type: [Types.ObjectId], ref: "User" },
    tags:{ type: [Types.ObjectId], ref: "Tag" },
    privacy:{ type: Number, enum: postPrivacyEnum, default: postPrivacyEnum.public },
    createdBy:{ type: Types.ObjectId, ref: "User", required: true },
    changeCredentialsTime:Date

},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    strict:true,
    strictQuery:true,
    collection:"SOCIAL_APP_POSTS"
});

postSchema.pre(["findOne", "find"], function() {
  console.log(this.getQuery())
  const query=this.getQuery()

  if(!query.getSoftDelete){
    this.setQuery({...query, changeCredentialsTime: { $exists: false }})
  }
});

export const PostModel=models.post || model<IPost>("Post", postSchema);