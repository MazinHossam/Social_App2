
import {Router} from "express"
import { authenticateToken } from "../../middleware/authentication.middleware";

import postService from "./post.service";

import { cloudFileUpload, fileValidation } from "../../common/utils/multer/cloud.multer";
import { Validation } from "../../middleware";
import { createPostSchema, updatePostSchema } from "./post.validation";


const postController=Router()

postController.post(
  "/Upload-Post",
  authenticateToken(),
  cloudFileUpload({ validation: fileValidation.image }).array("attachment", 5),
  Validation(createPostSchema),
  async (req, res) => {
    const post = await postService.createPost(
      req.body,
      req.user._id,
      req.files as Express.Multer.File[]
    );

    return res.status(201).json({
      message: "Done",
      data: post
    });
  }
);
postController.patch(
  "/Update-Post/:postId",
  authenticateToken(),
  cloudFileUpload({ validation: fileValidation.image }).array("attachment", 5),
  Validation(updatePostSchema),
  async (req, res) => {
    const post = await postService.updatePost(
      req.body,
       req.params.postId as string,
      req.user._id,
      req.files as Express.Multer.File[],
     
    );

    return res.status(201).json({
      message: "Done",
      data: post
    });
  }
);
postController.get(
  "/All-Post",
  authenticateToken(),

  async (req, res) => {
    const post = await postService.findPost(req.user, req.query );


    return res.status(201).json({
      message: "Done",
      data: post
    });
  }
);

 
export default postController