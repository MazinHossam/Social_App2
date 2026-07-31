import { IPost } from './../model/post.model';

import { DatabaseRepository } from "./DB.repo";

import { PostModel } from "../model/post.model";


  class PostRepository extends DatabaseRepository<IPost> {
    constructor(){
        super(PostModel)
    }
}

export default new PostRepository()
