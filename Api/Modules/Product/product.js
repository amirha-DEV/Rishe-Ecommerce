import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./productCn.js";
import isAdmin from "../../Middleware/isAdmin.js";
import {
  productIdValidator,
  createProductValidator,
  updateProductValidator,
} from "./productValidator.js";
import isLogin from "../../Middleware/isLogin.js";

const productRouter = Router();
productRouter
  .route("/")
  .get(getAll)
  .post(isLogin,isAdmin, createProductValidator, create);
productRouter
  .route("/:id")
  .get(productIdValidator, getOne)
  .patch(
    isLogin,
    isAdmin,
    productIdValidator,
    updateProductValidator,
    update,
  )
  .delete(isLogin, isAdmin, productIdValidator, remove);

export default productRouter;
