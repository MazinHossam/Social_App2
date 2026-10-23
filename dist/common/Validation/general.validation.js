"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalVlaidation = void 0;
const zod_1 = require("zod");
exports.generalVlaidation = {
    email: zod_1.z.email(),
    password: zod_1.z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/, { error: "weak password" }),
    username: zod_1.z.string({ error: "username is required" }).min(2, { error: "min is 2 char" }).max(20, { error: "max is 20 char" }),
    confirmPassword: zod_1.z.string(),
    phone: zod_1.z.string().regex(/^01[0125]\d{8}$/, { error: "invalid phone number" }),
    gender: zod_1.z.string().optional(),
    OTP: zod_1.z.string().length(6).regex(new RegExp(/^\d+$/))
};
