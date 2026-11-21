import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./productVariantCn.js";
import isAdmin from "../../Middleware/isAdmin.js";
import {
  validateCreateProductVariant,
  validateUpdateProductVariant,
  validateGetProductVariant,
  validateDeleteProductVariant,
  validateGetProductVariants,
} from "./productVariantValidator.js";

const productVariantRouter = Router();
productVariantRouter
  .route("/")
  .get(validateGetProductVariants, getAll)
  .post(isAdmin, validateCreateProductVariant, create);
productVariantRouter
  .route("/:id")
  .get(validateGetProductVariant, getOne)
  .patch(isAdmin, validateUpdateProductVariant, update)
  .delete(isAdmin, validateDeleteProductVariant, remove);

export default productVariantRouter;
