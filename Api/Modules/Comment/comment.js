import { Router } from "express";

import isAdmin from "../../Middleware/isAdmin.js";
import isLogin from "../../Middleware/isLogin.js";

import {
  changePublish,
  create,
  getAll,
  getAllCommentOfProduct,
  remove,
  replay,
} from "./commentsCn.js";

import {
  commentIdValidator,
  createCommentValidator,
  productCommentIdValidator,
  replyCommentValidator,
} from "./commentValidator.js";

const commentRouter = Router();

commentRouter
  .route("/")
  .get(isAdmin, getAll)
  .post(isLogin, createCommentValidator, create);

commentRouter
  .route("/:id")
  .get(productCommentIdValidator, getAllCommentOfProduct)
  .post(isLogin, replyCommentValidator, replay)
  .patch(isAdmin, commentIdValidator, changePublish)
  .delete(isAdmin, commentIdValidator, remove);

export default commentRouter;
