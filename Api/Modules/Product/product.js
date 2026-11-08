import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./productCn.js";
import isAdmin from "../../Middleware/isAdmin.js";
import {
  productIdValidator,
  createProductValidator,
  updateProductValidator,
} from "./productValidator.js";

const productRouter = Router();
productRouter
  .route("/")
  .get(getAll)
  .post(isAdmin, createProductValidator, create);
productRouter
  .route("/:id")
  .get(productIdValidator, getOne)
  .patch(
    isAdmin,
    productIdValidator,
    updateProductValidator,
    update,
  )
  .delete(isAdmin, productIdValidator, remove);

export default productRouter;
