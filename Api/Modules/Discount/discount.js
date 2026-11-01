import { Router } from "express";
import isAdmin from "../../Middleware/isAdmin.js";
import isLogin from "../../Middleware/isLogin.js";

import {
  checkCode,
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./discountCn.js";

import {
  checkDiscountCodeValidator,
  createDiscountValidator,
  discountIdValidator,
  updateDiscountValidator,
} from "./discountValidator.js";

const discountRouter = Router();

discountRouter
  .route("/check-code")
  .post(isLogin, checkDiscountCodeValidator, checkCode);

discountRouter
  .route("/")
  .get(isAdmin, getAll)
  .post(isAdmin, createDiscountValidator, create);

discountRouter
  .route("/:id")
  .get(isAdmin, discountIdValidator, getOne)
  .patch(isAdmin, updateDiscountValidator, update)
  .delete(isAdmin, discountIdValidator, remove);

export default discountRouter;
