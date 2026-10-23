"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const middleware_1 = require("./middleware");
const config_1 = require("./config/config");
const DB_connection_1 = __importDefault(require("./DB/DB.connection"));
const DB_Repository_1 = require("./DB/DB.Repository");
const user_controller_1 = __importDefault(require("./modules/user/user.controller"));
const cors_1 = __importDefault(require("cors"));
const post_controller_1 = __importDefault(require("./modules/post/post.controller"));
const bootstrap = async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.get("/", (req, res, next) => {
        res.json("welcome to my landing page");
    });
    await (0, DB_connection_1.default)();
    await (0, DB_Repository_1.connectRedies)();
    app.use("/auth", modules_1.authRouter);
    app.use("/user", user_controller_1.default);
    app.use("/post", post_controller_1.default);
    app.use(middleware_1.globalErrorHandler);
    app.get("/*dummy", (req, res, next) => {
        res.status(404).json("invalid page errorrrrrrrr");
    });
    app.listen(config_1.PORT, () => {
        console.log(`server is running on port  ${config_1.PORT}`);
    });
};
exports.default = bootstrap;
