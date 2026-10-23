"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config/config");
const User_enums_1 = require("../../enums/User.enums");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const token_enum_1 = require("../../enums/token.enum");
class TokenService {
    getSignature(role = User_enums_1.RoleEnum.USER) {
        let accessTokensignature = "";
        let refreshSignature = "";
        switch (role) {
            case User_enums_1.RoleEnum.USER:
                accessTokensignature = config_1.TOKEN_KEY_USER ?? '';
                refreshSignature = config_1.TOKEN_KEY_USER_REFRESH ?? '';
                break;
            case User_enums_1.RoleEnum.ADMIN:
                accessTokensignature = config_1.TOKEN_KEY_ADMIN ?? '';
                refreshSignature = config_1.TOKEN_KEY_ADMIN_REFRESH ?? '';
                break;
        }
        return { accessTokensignature, refreshSignature };
    }
    createToken({ payload = {}, signature, options = {} }) {
        return jsonwebtoken_1.default.sign(payload, signature, options);
    }
    generateToken(user) {
        const { accessTokensignature, refreshSignature } = this.getSignature(user.role);
        const tokenId = (0, crypto_1.randomUUID)();
        const accessToken = this.createToken({
            signature: accessTokensignature,
            options: {
                audience: [String(user.role), token_enum_1.TokenType.access],
                expiresIn: 60 * 15,
                subject: user._id.toString(),
                jwtid: tokenId
            }
        });
        const refreshtoken = this.createToken({
            signature: refreshSignature,
            options: {
                audience: [String(user.role), token_enum_1.TokenType.refresh],
                expiresIn: '1y',
                subject: user._id.toString(),
                jwtid: tokenId
            }
        });
        return { accessToken, refreshtoken };
    }
    verifyToken({ token, signature }) {
        return jsonwebtoken_1.default.verify(token, signature);
    }
    decodeToken(token) {
        return jsonwebtoken_1.default.decode(token);
    }
}
exports.default = new TokenService();
