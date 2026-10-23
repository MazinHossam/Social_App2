"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autholaitaion = void 0;
exports.authenticateToken = authenticateToken;
const exceptions_1 = require("../common/exceptions");
const token_service_1 = __importDefault(require("../common/utils/security/token.service"));
const enums_1 = require("../common/enums");
const redise_service_1 = __importDefault(require("../common/service/redise.service"));
const user_repo_1 = __importDefault(require("../DB/DB.Repository/user.repo"));
function authenticateToken() {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new exceptions_1.BadRequestException('Token is required');
        }
        const decoded = token_service_1.default.decodeToken(token);
        if (!decoded || !decoded.aud) {
            throw new exceptions_1.BadRequestException('Invalid token');
        }
        const [userRole, TokenType] = decoded.aud;
        if (TokenType != 'access') {
            throw new exceptions_1.BadRequestException('Invalid token type');
        }
        const { accessTokensignature } = token_service_1.default.getSignature(Number(userRole));
        const verified = token_service_1.default.verifyToken({ token, signature: accessTokensignature });
        if (await redise_service_1.default.get(`blackList::${verified.sub}::${verified.jti}`)) {
            throw new exceptions_1.UnauthorizedException('You Need to Login Again');
        }
        if (!verified.sub) {
            throw new exceptions_1.BadRequestException("Invalid token");
        }
        const user = await user_repo_1.default.findById({ _id: verified.sub });
        if (!user) {
            throw new exceptions_1.NotFoundException('User not found');
        }
        if (new Date(verified.iat * 1000) < user.changeCredentialsTime) {
            throw new exceptions_1.UnauthorizedException('You Need to Login Again');
        }
        req.user = user;
        req.payloadToken = verified;
        return next();
    };
}
const autholaitaion = (roles = enums_1.RoleEnum.USER) => {
    return (req, res, next) => {
        if (req.user.role !== roles) {
            throw new exceptions_1.BadRequestException('Unauthorized');
        }
        return next();
    };
};
exports.autholaitaion = autholaitaion;
