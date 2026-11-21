import { Router } from "express";
import { getAll, getById, create, update, remove } from "./blogCn.js";
import isAdmin from "../../Middleware/isAdmin.js";
import {
  validateCreate,
  validateUpdate,
  validateGetAll,
  validateGetById,
  validateRemove,
} from "./blogValidator.js";

const blogRouter = Router();
blogRouter
  .route("/")
  .get(validateGetAll, getAll)
  .post(isAdmin, validateCreate, create);
blogRouter
  .route("/:id")
  .get(validateGetById, getById)
  .patch(isAdmin, validateUpdate, update)
  .delete(isAdmin, validateRemove, remove);

export default blogRouter;
