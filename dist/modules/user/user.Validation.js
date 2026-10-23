"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.logOutSchema = {
    body: zod_1.default.object({
        logoutOptions: zod_1.default.enum(["all", "single"])
    })
};
