"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_repo_1 = require("./DB.repo");
const post_model_1 = require("../model/post.model");
class PostRepository extends DB_repo_1.DatabaseRepository {
    constructor() {
        super(post_model_1.PostModel);
    }
}
exports.default = new PostRepository();
