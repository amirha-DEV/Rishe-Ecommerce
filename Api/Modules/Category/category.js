import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./categoryCn.js";

import isAdmin from "../../Middleware/isAdmin.js";

import {
  validateCreateCategory,
  validateDeleteCategory,
  validateGetCategory,
  validateUpdateCategory,
} from "./categoryValidator.js";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(getAll)
  .post(isAdmin, validateCreateCategory, create);

categoryRouter
  .route("/:id")
  .get(validateGetCategory, getOne)
  .patch(isAdmin, validateUpdateCategory, update)
  .delete(isAdmin, validateDeleteCategory, remove);

export default categoryRouter;
