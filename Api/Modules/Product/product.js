import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./productCn.js";
import isAdmin from "../../Middleware/isAdmin.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import {
  productIdValidator,
  createProductValidator,
  updateProductValidator,
} from "./productValidator.js";

const productRouter = Router();
productRouter
  .route("/")
  .get(getAll)
  .post(isAdmin, createProductValidator, handleValidationErrors, create);
productRouter
  .route("/:id")
  .get(productIdValidator, handleValidationErrors, getOne)
  .patch(
    isAdmin,
    productIdValidator,
    updateProductValidator,
    handleValidationErrors,
    update,
  )
  .delete(isAdmin, productIdValidator, handleValidationErrors, remove);

export default productRouter;
