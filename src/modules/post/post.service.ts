import { Types } from "mongoose";
import postRepo from "../../DB/DB.Repository/post.repo";
import { PostFileDto, updatePostDto } from "./post.dto";
import userRepo from "../../DB/DB.Repository/user.repo";
import { BadRequestException, NotFoundException } from "../../common/exceptions";
import rediseService from "../../common/service/redise.service";
import NotificationService from "../../common/utils/Notification/Notification.service";
import configureCloudinary from "../../common/utils/multer/clodinary";
import { postPrivacyEnum } from "../../common/enums/postPrivacy.Enum";
import { IUser } from "../../common/interfaces";

class PostService {
    private _postRepo = postRepo;
    private _userRepo = userRepo;
    private _redisService = rediseService;
    private _notificationService = NotificationService;

    async createPost(
        bodydata: PostFileDto,
        userId: Types.ObjectId | string,
        files?: Express.Multer.File[]
    ) {

        const tags = bodydata.tags ?? [];

        if (tags.length) {
            const mentionedUsers = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            });

            if (mentionedUsers.length !== tags.length) {
                throw new BadRequestException("Some tags are invalid");
            }
        }

        const attachment: {
            secure_url: string;
            public_id: string;
        }[] = [];

        if (files?.length) {
            for (const file of files) {
                const { secure_url, public_id } =
                    await configureCloudinary().uploader.upload(file.path, {
                        folder: `${process.env.APP_NAME}/posts/${userId}`
                    });

                attachment.push({
                    secure_url,
                    public_id
                });
            }
        }

        const post = await this._postRepo.createOne({
            data: {
                ...bodydata,
                createdBy: userId,
                attachment
            }
        });

        for (const tag of tags) {
            const tokens = await this._redisService.getSetMembers(tag);

            if (tokens.length) {
                await this._notificationService.sendNotifications({
                    tokens,
                    notification: {
                        title: "New Mention",
                        body: `You have been mentioned in a post ${bodydata.content}.`
                    }
                });
            }
        }

        return post;
    }
    async updatePost(
        bodydata: updatePostDto,
        postId: Types.ObjectId | string,
        userId: Types.ObjectId | string,
        files?: Express.Multer.File[]
    ) {

        const post =await this._postRepo.findOne({
            filter: { _id: postId, createdBy: userId }
        })
        if(!post){
            throw new NotFoundException("Post not found");
        }

        if(!post.content && !bodydata.content && !post.attachment?.length && !files?.length && post.attachment?.length == bodydata.removeFiles?.length){
                  throw new BadRequestException("can not leave post empty");
        }

        const tags = bodydata.tags ?? [];

        if (tags.length) {
            const mentionedUsers = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            });

            if (mentionedUsers.length !== tags.length) {
                throw new BadRequestException("Some tags are invalid");
            }
        }

        const attachment: {
            secure_url: string;
            public_id: string;
        }[] = [];

        if (files?.length) {
            for (const file of files) {
                const { secure_url, public_id } =
                    await configureCloudinary().uploader.upload(file.path, {
                        folder: `${process.env.APP_NAME}/posts/${userId}`
                    });

                attachment.push({
                    secure_url,
                    public_id
                });
            }
        }

        // const post = await this._postRepo.createOne({
        //     data: {
        //         ...bodydata,
        //         createdBy: userId,
        //         attachment
        //     }
        // });

        if(bodydata.removeFiles && bodydata.removeFiles.length){
        await configureCloudinary().api.delete_resources(bodydata.removeFiles);
        }

        for (const tag of tags) {
            const tokens = await this._redisService.getSetMembers(tag);

            if (tokens.length) {
                await this._notificationService.sendNotifications({
                    tokens,
                    notification: {
                        title: "New Mention",
                        body: `You have been mentioned in a post ${bodydata.content}.`
                    }
                });
            }
        }

        // await post.updateOne({
        //     content:bodydata.content || post.content,
        //     privacy:bodydata.privacy || post.privacy
        // })
        

        return await this._postRepo.findOneAndUpdate({filter: { _id: postId },
    
            update: [{
                $set:{
                   content:bodydata.content || post.content,
                   privacy:bodydata.privacy || post.privacy,

                   tags:{
                    $setUnion:[
                        {
                            $setDifference:["$tags", bodydata.removeTag],
                           
                        },
                         bodydata.tags || []
                    ]
                   }
            }
        }
        ],
        options:{
            updatePipeline:true,
            returnDocument:"after"
        }
    })
        return post;
    }


async findPost(user: IUser, query: any){


    return this._postRepo.paginateTest({
   filter:{
         $or:[
            {privacy: postPrivacyEnum.public},
            {createdBy: {$in:user.friends!}, 
             privacy: postPrivacyEnum.friends},
            {tags:{ $in: [user._id] }},
            {createdBy:{ $in: user._id }}
        ]
   },
   page:query.page,
   size:query.size
    })
}
}

export default new PostService();