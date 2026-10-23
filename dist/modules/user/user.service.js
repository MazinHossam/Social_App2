"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redise_service_1 = __importDefault(require("../../common/service/redise.service"));
const user_repo_1 = __importDefault(require("../../DB/DB.Repository/user.repo"));
const clodinary_1 = __importDefault(require("../../common/utils/multer/clodinary"));
class UserService {
    _redisMethod = redise_service_1.default;
    _userRepository = user_repo_1.default;
    async logout(userId, tokenData, logoutOptions) {
        if (logoutOptions == "all") {
            await this._userRepository.updateOne({
                filter: { _id: userId },
                update: { changeCredentialsTime: Date.now() }
            });
            return;
        }
        else {
            await this._redisMethod.set({
                key: this._redisMethod.getblackList({
                    userId: userId,
                    tokenId: tokenData.jti || ""
                }),
                value: tokenData.jti,
                exValue: (60 * 60 * 24 * 365) - (Date.now() / 1000 - tokenData.iat)
            });
        }
    }
    async profileImage(path, user) {
        const { secure_url, public_id } = await (0, clodinary_1.default)().uploader.upload(path, {
            folder: `${process.env.APP_NAME}/users/${user._id}`
        });
        const userprofile = await this._userRepository.findOne({ filter: { _id: user._id } });
        if (userprofile) {
            await this._userRepository.updateOne({
                filter: { _id: user._id },
                update: { profilPic: { secure_url, public_id } },
                options: { upsert: false }
            });
            if (userprofile?.profilPic?.public_id) {
                await (0, clodinary_1.default)().uploader.destroy(userprofile.profilPic.public_id);
            }
        }
        return userprofile;
    }
}
exports.default = new UserService();
