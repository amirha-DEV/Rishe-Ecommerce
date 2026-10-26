import { Router } from "express";

import { changePasssword, deActive, getAll, getOne, update } from "./userCn.js";

import isAdmin from "../../Middleware/isAdmin.js";
import isLogin from "../../Middleware/isLogin.js";

import {
  changePasswordValidator,
  updateUserValidator,
  userIdValidator,
} from "./userValidator.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";


const userRouter = Router();

// Get All Users
userRouter.route("/").get(isAdmin, getAll);

// Change Password
userRouter
  .route("/change-password")
  .patch(
    isLogin,
    changePasswordValidator,
    handleValidationErrors,
    changePasssword,
  );

// Get One User
userRouter
  .route("/:id")
  .get(isLogin, userIdValidator, handleValidationErrors, getOne)

  // Deactivate / Activate User
  .delete(isAdmin, userIdValidator, handleValidationErrors, deActive)

  // Update User
  .patch(isLogin, updateUserValidator, handleValidationErrors, update);

export default userRouter;
