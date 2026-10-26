import { Router } from "express";
import {
  auth,
  forgetPassword,
  loginWithOtp,
  loginWithPassword,
  resendCode,
} from "./authCn.js";
import {
  authValidator,
  forgetPasswordValidator,
  loginWithOtpValidator,
  loginWithPasswordValidator,
  resendCodeValidator,
} from "./authValidator.js";

const authRouter = Router();

authRouter.route("/").post(authValidator, auth);
authRouter
  .route("/login-password")
  .post(loginWithPasswordValidator, loginWithPassword);
authRouter.route("/login-otp").post(loginWithOtpValidator, loginWithOtp);
authRouter
  .route("/forget-password")
  .post(forgetPasswordValidator, forgetPassword);
authRouter.route("/resend-code").post(resendCodeValidator, resendCode);

export default authRouter;
