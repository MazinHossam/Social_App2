"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const hash_security_1 = require("./../../common/utils/security/hash.security");
const mongoose_1 = require("mongoose");
const enums_1 = require("../../common/enums");
const email_service_1 = __importDefault(require("../../common/utils/email/email.service"));
const email_enums_1 = require("../../common/enums/email.enums");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function () {
            return this.provider === enums_1.ProviderEnum.SYSTEM;
        }
    },
    phone: { type: String },
    profilPic: { secure_url: String, public_id: String },
    profileCoverPictures: { secure_url: String, public_id: String },
    friends: [{ type: mongoose_1.Types.ObjectId, ref: "User" }],
    gender: { type: Number, enum: enums_1.GenderEnum, default: enums_1.GenderEnum.SYSTEM },
    role: { type: Number, enum: enums_1.RoleEnum, default: enums_1.RoleEnum.USER },
    provider: { type: Number, enum: enums_1.ProviderEnum, default: enums_1.ProviderEnum.SYSTEM },
    changeCredentialsTime: { type: Date },
    DOB: { type: Date },
    confirmEmail: { type: Boolean, default: false },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
    collection: "SOCIAL_APP_USERS"
});
userSchema.pre("save", async function () {
    this.wasNew = this.isNew;
    if (this.isModified("password")) {
        this.password = await (0, hash_security_1.generateHash)({ plainText: this.password });
    }
});
userSchema.post("save", async function () {
    try {
        if (this.wasNew) {
            await email_service_1.default.sendEmailOTP({
                email: this.email,
                emailType: email_enums_1.EmailTypeEnum.confirmEmail,
                subject: "Verify Your Email"
            });
        }
    }
    catch (error) {
        console.error("Error occurred while saving user:", error);
    }
});
userSchema.virtual("username").set(function (value) {
    const [firstName, lastName] = value.split(' ') || [];
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
exports.UserModel = mongoose_1.models.user || (0, mongoose_1.model)("User", userSchema);
