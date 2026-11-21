import { Router } from "express";
import isAdmin from "../../Middleware/isAdmin.js";
import isLogin from "../../Middleware/isLogin.js";
import {
  changePublish,
  create,
  getAll,
  getAllCommentOfBlog,
  remove,
  replay,
} from "./blogCommentCn.js";
import {
  blogCommentIdValidator,
  blogIdValidator,
  createBlogCommentValidator,
  replyBlogCommentValidator,
} from "./blogCommentVr.js";

const blogCommentRouter = Router();
blogCommentRouter
  .route("/")
  .get(isAdmin, getAll)
  .post(isLogin, createBlogCommentValidator, create);
blogCommentRouter.route("/blog/:id").get(blogIdValidator, getAllCommentOfBlog);
blogCommentRouter
  .route("/:id")
  .post(isLogin, replyBlogCommentValidator, replay)
  .patch(isAdmin, blogCommentIdValidator, changePublish)
  .delete(isAdmin, blogCommentIdValidator, remove);

export default blogCommentRouter;
