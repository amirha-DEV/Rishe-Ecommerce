import { query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

export const searchValidator = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("عبارت جست‌وجو باید بین 1 تا 100 کاراکتر باشد"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("شماره صفحه باید عدد صحیح مثبت باشد"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("تعداد نتایج باید بین 1 تا 100 باشد"),

  query("sort")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("مقدار مرتب‌سازی معتبر نیست"),

  handleValidationErrors,
];
