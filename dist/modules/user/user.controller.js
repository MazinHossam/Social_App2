"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const success_responce_1 = require("../../common/success.responce/success.responce");
const user_service_1 = __importDefault(require("./user.service"));
const middleware_1 = require("../../middleware");
const user_Validation_1 = require("./user.Validation");
const cloud_multer_1 = require("../../common/utils/multer/cloud.multer");
const userController = (0, express_1.Router)();
userController.get("/", (0, authentication_middleware_1.authenticateToken)(), (req, res) => {
    return (0, success_responce_1.successResponce)({ res, status: 201, data: req.user });
});
userController.post('/logOut', (0, authentication_middleware_1.authenticateToken)(), (0, middleware_1.Validation)(user_Validation_1.logOutSchema), async (req, res) => {
    const data = await user_service_1.default.logout(req.user._id, req.payloadToken, req.body.logoutOptions);
    console.log(data);
    return (0, success_responce_1.successResponce)({ res, status: 201, data: "User logged out successfully" });
});
userController.patch("/profile-image", (0, authentication_middleware_1.authenticateToken)(), (0, cloud_multer_1.cloudFileUpload)({ validation: cloud_multer_1.fileValidation.image }).single("image"), async (req, res) => {
    const result = await user_service_1.default.profileImage(req.file.path, req.user);
    return (0, success_responce_1.successResponce)({
        res,
        status: 201,
        data: result
    });
});
exports.default = userController;
