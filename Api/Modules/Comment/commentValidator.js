import { body, param } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

export const createCommentValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 3, max: 2000 })
    .withMessage("Content must be between 3 and 2000 characters"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  handleValidationErrors,
];

export const replyCommentValidator = [
  param("id").isMongoId().withMessage("Invalid comment ID"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 3, max: 2000 })
    .withMessage("Content must be between 3 and 2000 characters"),

  handleValidationErrors,
];

export const commentIdValidator = [
  param("id").isMongoId().withMessage("Invalid comment ID"),

  handleValidationErrors,
];

export const productCommentIdValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),

  handleValidationErrors,
];
