import { body, param } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

// اعتبارسنجی ثبت کامنت جدید
export const createBlogCommentValidator = [
  body("blogId")
    .notEmpty()
    .withMessage("شناسه مقاله الزامی است.")
    .isMongoId()
    .withMessage("شناسه مقاله معتبر نیست."),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("متن کامنت الزامی است.")
    .isLength({ min: 3, max: 2000 })
    .withMessage("متن کامنت باید بین ۳ تا ۲۰۰۰ کاراکتر باشد."),

  handleValidationErrors,
];

// اعتبارسنجی پاسخ به کامنت
export const replyBlogCommentValidator = [
  param("id")
    .isMongoId()
    .withMessage("شناسه کامنت معتبر نیست."),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("متن پاسخ الزامی است.")
    .isLength({ min: 3, max: 2000 })
    .withMessage("متن پاسخ باید بین ۳ تا ۲۰۰۰ کاراکتر باشد."),

  handleValidationErrors,
];

// اعتبارسنجی شناسه کامنت
export const blogCommentIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("شناسه کامنت معتبر نیست."),

  handleValidationErrors,
];

// اعتبارسنجی شناسه مقاله
export const blogIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("شناسه مقاله معتبر نیست."),

  handleValidationErrors,
];
