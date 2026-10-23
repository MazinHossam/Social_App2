"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const postPrivacy_Enum_1 = require("../../common/enums/postPrivacy.Enum");
const postSchema = new mongoose_1.Schema({
    content: { type: String, required: function () {
            return !this.attachment?.length;
        } },
    attachment: { type: [{ secure_url: String, public_id: String }] },
    likes: { type: [mongoose_1.Types.ObjectId], ref: "User" },
    tags: { type: [mongoose_1.Types.ObjectId], ref: "Tag" },
    privacy: { type: Number, enum: postPrivacy_Enum_1.postPrivacyEnum, default: postPrivacy_Enum_1.postPrivacyEnum.public },
    createdBy: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    changeCredentialsTime: Date
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
    collection: "SOCIAL_APP_POSTS"
});
postSchema.pre(["findOne", "find"], function () {
    console.log(this.getQuery());
    const query = this.getQuery();
    if (!query.getSoftDelete) {
        this.setQuery({ ...query, changeCredentialsTime: { $exists: false } });
    }
});
exports.PostModel = mongoose_1.models.post || (0, mongoose_1.model)("Post", postSchema);
