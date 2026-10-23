"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const post_service_1 = __importDefault(require("./post.service"));
const cloud_multer_1 = require("../../common/utils/multer/cloud.multer");
const middleware_1 = require("../../middleware");
const post_validation_1 = require("./post.validation");
const postController = (0, express_1.Router)();
postController.post("/Upload-Post", (0, authentication_middleware_1.authenticateToken)(), (0, cloud_multer_1.cloudFileUpload)({ validation: cloud_multer_1.fileValidation.image }).array("attachment", 5), (0, middleware_1.Validation)(post_validation_1.createPostSchema), async (req, res) => {
    const post = await post_service_1.default.createPost(req.body, req.user._id, req.files);
    return res.status(201).json({
        message: "Done",
        data: post
    });
});
postController.patch("/Update-Post/:postId", (0, authentication_middleware_1.authenticateToken)(), (0, cloud_multer_1.cloudFileUpload)({ validation: cloud_multer_1.fileValidation.image }).array("attachment", 5), (0, middleware_1.Validation)(post_validation_1.updatePostSchema), async (req, res) => {
    const post = await post_service_1.default.updatePost(req.body, req.params.postId, req.user._id, req.files);
    return res.status(201).json({
        message: "Done",
        data: post
    });
});
postController.get("/All-Post", (0, authentication_middleware_1.authenticateToken)(), async (req, res) => {
    const post = await post_service_1.default.findPost(req.user, req.query);
    return res.status(201).json({
        message: "Done",
        data: post
    });
});
exports.default = postController;
