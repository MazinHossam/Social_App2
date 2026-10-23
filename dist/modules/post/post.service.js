"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_repo_1 = __importDefault(require("../../DB/DB.Repository/post.repo"));
const user_repo_1 = __importDefault(require("../../DB/DB.Repository/user.repo"));
const exceptions_1 = require("../../common/exceptions");
const redise_service_1 = __importDefault(require("../../common/service/redise.service"));
const Notification_service_1 = __importDefault(require("../../common/utils/Notification/Notification.service"));
const clodinary_1 = __importDefault(require("../../common/utils/multer/clodinary"));
const postPrivacy_Enum_1 = require("../../common/enums/postPrivacy.Enum");
class PostService {
    _postRepo = post_repo_1.default;
    _userRepo = user_repo_1.default;
    _redisService = redise_service_1.default;
    _notificationService = Notification_service_1.default;
    async createPost(bodydata, userId, files) {
        const tags = bodydata.tags ?? [];
        if (tags.length) {
            const mentionedUsers = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            });
            if (mentionedUsers.length !== tags.length) {
                throw new exceptions_1.BadRequestException("Some tags are invalid");
            }
        }
        const attachment = [];
        if (files?.length) {
            for (const file of files) {
                const { secure_url, public_id } = await (0, clodinary_1.default)().uploader.upload(file.path, {
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
    async updatePost(bodydata, postId, userId, files) {
        const post = await this._postRepo.findOne({
            filter: { _id: postId, createdBy: userId }
        });
        if (!post) {
            throw new exceptions_1.NotFoundException("Post not found");
        }
        if (!post.content && !bodydata.content && !post.attachment?.length && !files?.length && post.attachment?.length == bodydata.removeFiles?.length) {
            throw new exceptions_1.BadRequestException("can not leave post empty");
        }
        const tags = bodydata.tags ?? [];
        if (tags.length) {
            const mentionedUsers = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            });
            if (mentionedUsers.length !== tags.length) {
                throw new exceptions_1.BadRequestException("Some tags are invalid");
            }
        }
        const attachment = [];
        if (files?.length) {
            for (const file of files) {
                const { secure_url, public_id } = await (0, clodinary_1.default)().uploader.upload(file.path, {
                    folder: `${process.env.APP_NAME}/posts/${userId}`
                });
                attachment.push({
                    secure_url,
                    public_id
                });
            }
        }
        if (bodydata.removeFiles && bodydata.removeFiles.length) {
            await (0, clodinary_1.default)().api.delete_resources(bodydata.removeFiles);
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
        return await this._postRepo.findOneAndUpdate({ filter: { _id: postId },
            update: [{
                    $set: {
                        content: bodydata.content || post.content,
                        privacy: bodydata.privacy || post.privacy,
                        tags: {
                            $setUnion: [
                                {
                                    $setDifference: ["$tags", bodydata.removeTag],
                                },
                                bodydata.tags || []
                            ]
                        }
                    }
                }
            ],
            options: {
                updatePipeline: true,
                returnDocument: "after"
            }
        });
        return post;
    }
    async findPost(user, query) {
        return this._postRepo.paginateTest({
            filter: {
                $or: [
                    { privacy: postPrivacy_Enum_1.postPrivacyEnum.public },
                    { createdBy: { $in: user.friends },
                        privacy: postPrivacy_Enum_1.postPrivacyEnum.friends },
                    { tags: { $in: [user._id] } },
                    { createdBy: { $in: user._id } }
                ]
            },
            page: query.page,
            size: query.size
        });
    }
}
exports.default = new PostService();
