import { body, param } from "express-validator";

export const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),

  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Full name must be between 3 and 50 characters"),

  body("birthDate").optional().isISO8601().withMessage("Invalid birth date"),

  body("role")
    .optional()
    .isIn(["user", "admin", "superAdmin"])
    .withMessage("Invalid user role"),
];

export const changePasswordValidator = [
  body("oldPassword")
    .optional()
    .isString()
    .withMessage("Old password must be a string"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .bail()
    .isString()
    .withMessage("New password must be a string")
    .bail()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)
    .withMessage(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
    ),
];

export const userIdValidator = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];
