"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudFileUpload = exports.fileValidation = void 0;
const multer_1 = __importDefault(require("multer"));
exports.fileValidation = {
    image: ["image/jpeg", "image/png"],
    document: ["application/pdf", "application/json"],
};
const cloudFileUpload = ({ validation = [], }) => {
    const storage = multer_1.default.diskStorage({});
    const fileFilter = (req, file, callback) => {
        if (validation.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error("Invalid file format"));
        }
    };
    return (0, multer_1.default)({
        storage,
        fileFilter,
    });
};
exports.cloudFileUpload = cloudFileUpload;
