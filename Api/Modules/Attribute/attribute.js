import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./attributeCn.js";
import isAdmin from "../../Middleware/isAdmin.js";
import {
  validateCreateAttribute,
  validateDeleteAttribute,
  validateGetAttribute,
  validateUpdateAttribute,
} from "./attributeValidator.js";

const attributeRouter = Router();
attributeRouter
  .route("/")
  .get(getAll)
  .post(isAdmin, validateCreateAttribute, create);
attributeRouter
  .route("/:id")
  .get(validateGetAttribute, getOne)
  .patch(isAdmin, validateUpdateAttribute, update)
  .delete(isAdmin, validateDeleteAttribute, remove);

export default attributeRouter;
