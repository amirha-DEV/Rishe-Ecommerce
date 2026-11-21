import { Router } from "express";
import { getAll, getById, create, update, remove } from "./blogCategoryCn.js";
import isAdmin from "../../Middleware/isAdmin.js";
import {
  validateCreateBlogCategory,
  validateUpdateBlogCategory,
  validateGetBlogCategory,
  validateRemoveBlogCategory,
  validateGetAllBlogCategories,
} from "./blogCategoryValidator.js";

const blogCategoryRouter = Router();
blogCategoryRouter
  .route("/")
  .get(validateGetAllBlogCategories, getAll)
  .post(isAdmin, validateCreateBlogCategory, create);
blogCategoryRouter
  .route("/:id")
  .get(validateGetBlogCategory, getById)
  .patch(isAdmin, validateUpdateBlogCategory, update)
  .delete(isAdmin, validateRemoveBlogCategory, remove);

export default blogCategoryRouter;
