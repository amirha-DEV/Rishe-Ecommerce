import { Router } from "express";
import {
  addFavorite,
  changePassword,
  deActive,
  getAll,
  getFavorites,
  getOne,
  removeFavorite,
  update,
} from "./userCn.js";
import isAdmin from "../../Middleware/isAdmin.js";
import isLogin from "../../Middleware/isLogin.js";
import {
  changePasswordValidator,
  favoriteProductValidator,
  updateUserValidator,
  userIdValidator,
} from "./userValidator.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

const userRouter = Router();
userRouter.route("/").get(isAdmin, getAll);
userRouter
  .route("/change-password")
  .patch(
    isLogin,
    changePasswordValidator,
    handleValidationErrors,
    changePassword,
  );

userRouter.route("/me/favorites").get(isLogin, getFavorites);
userRouter
  .route("/me/favorites/:productId")
  .post(isLogin, favoriteProductValidator, handleValidationErrors, addFavorite)
  .delete(
    isLogin,
    favoriteProductValidator,
    handleValidationErrors,
    removeFavorite,
  );
userRouter
  .route("/:id")
  .get(isLogin, userIdValidator, handleValidationErrors, getOne)
  .delete(isAdmin, userIdValidator, handleValidationErrors, deActive)
  .patch(isLogin, updateUserValidator, handleValidationErrors, update);

export default userRouter;
