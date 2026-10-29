import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./brandCn.js";
import {
  validateBrandId,
  validateCreateBrand,
  validateUpdateBrand,
} from "./brandValidator.js";
import isAdmin from "../../Middleware/isAdmin.js";

const brandRouter = Router();

brandRouter.route("/").get(getAll).post(isAdmin, validateCreateBrand, create);

brandRouter
  .route("/:id")
  .get(validateBrandId, getOne)
  .patch(isAdmin, validateUpdateBrand, update)
  .delete(isAdmin, validateBrandId, remove);

export default brandRouter;
