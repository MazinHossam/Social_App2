"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_repo_1 = require("./DB.repo");
const user_model_1 = require("../model/user.model");
class UserRepository extends DB_repo_1.DatabaseRepository {
    constructor() {
        super(user_model_1.UserModel);
    }
}
exports.default = new UserRepository();
