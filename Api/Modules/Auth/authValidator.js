import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import { body } from "express-validator";
const phoneRule = body("phoneNumber")
  .trim()
  .notEmpty()
  .withMessage("phone number is required")
  .matches(/^09\d{9}$/)
  .withMessage("invalid phone number");

const passwordRule = body("password")
  .notEmpty()
  .withMessage("password is required");

const codeRule = body("code")
  .trim()
  .notEmpty()
  .withMessage("code is required")
  .isLength({ min: 4, max: 6 })
  .withMessage("code must be 4-6 digits long");

const newPasswordRule = body("newPassword")
  .notEmpty()
  .withMessage("new password is required")
  .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)
  .withMessage(
    "new password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, and one number",
  );

export const authValidator = [phoneRule, handleValidationErrors];

export const loginWithPasswordValidator = [
  phoneRule,
  passwordRule,
  handleValidationErrors,
];

export const loginWithOtpValidator = [
  phoneRule,
  codeRule,
  handleValidationErrors,
];

export const forgetPasswordValidator = [
  phoneRule,
  codeRule,
  newPasswordRule,
  handleValidationErrors,
];

export const resendCodeValidator = [phoneRule, handleValidationErrors];
