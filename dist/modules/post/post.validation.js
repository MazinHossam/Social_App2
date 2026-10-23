"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const postPrivacy_Enum_1 = require("../../common/enums/postPrivacy.Enum");
const mongoose_1 = require("mongoose");
exports.createPostSchema = {
    body: zod_1.default.object({
        content: zod_1.default.string().min(3).max(1000).optional(),
        files: zod_1.default.array(zod_1.default.any()).optional(),
        tags: zod_1.default.array(zod_1.default.string()).optional(),
        privacy: zod_1.default.coerce.number().default(postPrivacy_Enum_1.postPrivacyEnum.public)
    }).superRefine((args, crx) => {
        if (args.files?.length && !args.content) {
            crx.addIssue({
                code: "custom",
                path: ["content"],
                message: "you should add content at least or upload files"
            });
        }
        for (const tag of args.tags) {
            if (!mongoose_1.Types.ObjectId.isValid(tag)) {
                crx.addIssue({
                    code: "custom",
                    path: ["tags"],
                    message: `invalid tag object ${tag}`
                });
            }
        }
        const uniqueTags = [...new Set(args.tags)];
        if (uniqueTags.length != args.tags?.length) {
            crx.addIssue({
                code: "custom",
                path: ["tags"],
                message: "tags must be unique"
            });
        }
    }),
};
exports.updatePostSchema = {
    body: zod_1.default.object({
        content: zod_1.default.string().min(3).max(1000).optional(),
        files: zod_1.default.array(zod_1.default.any()).optional(),
        removeFiles: zod_1.default.array(zod_1.default.string().refine((value) => {
            return mongoose_1.Types.ObjectId.isValid(value);
        }, "invalid tag format")).optional(),
        tags: zod_1.default.array(zod_1.default.string()).optional(),
        removeTag: zod_1.default.array(zod_1.default.string().refine((value) => {
            return mongoose_1.Types.ObjectId.isValid(value);
        }, "invalid tag format")).optional(),
        privacy: zod_1.default.number().optional()
    }).superRefine((args, crx) => {
        for (const tag of args.tags) {
            if (!mongoose_1.Types.ObjectId.isValid(tag)) {
                crx.addIssue({
                    code: "custom",
                    path: ["tags"],
                    message: `invalid tag object ${tag}`
                });
            }
        }
        const uniqueTags = [...new Set(args.tags)];
        if (uniqueTags.length != args.tags?.length) {
            crx.addIssue({
                code: "custom",
                path: ["tags"],
                message: "tags must be unique"
            });
        }
    }),
    params: zod_1.default.object({
        postId: zod_1.default.string().refine((value) => {
            return mongoose_1.Types.ObjectId.isValid(value);
        }, "invalid tag format")
    })
};
