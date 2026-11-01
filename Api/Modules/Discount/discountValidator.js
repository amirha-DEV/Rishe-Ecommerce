import { body, param } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

// Create Discount
export const createDiscountValidator = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("کد تخفیف الزامی است")
    .isLength({ min: 3, max: 50 })
    .withMessage("کد تخفیف باید بین 3 تا 50 کاراکتر باشد"),

  body("type")
    .notEmpty()
    .withMessage("نوع تخفیف الزامی است")
    .isIn(["fixed", "percentage"])
    .withMessage("نوع تخفیف باید fixed یا percentage باشد"),

  body("value")
    .notEmpty()
    .withMessage("مقدار تخفیف الزامی است")
    .isFloat({ gt: 0 })
    .withMessage("مقدار تخفیف باید بیشتر از صفر باشد")
    .custom((value, { req }) => {
      if (req.body.type === "percentage" && Number(value) >= 100) {
        throw new Error("درصد تخفیف باید کمتر از 100 باشد");
      }
      return true;
    }),

  body("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("حداقل مبلغ نمی‌تواند منفی باشد"),

  body("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("حداکثر مبلغ نمی‌تواند منفی باشد"),

  body("startAt")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("تاریخ شروع معتبر نیست"),

  body("expireAt")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("تاریخ انقضا معتبر نیست"),

  body("usageLimit")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("محدودیت استفاده باید عدد صحیح مثبت باشد"),

  body("userUsedLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("محدودیت استفاده هر کاربر باید عدد صحیح مثبت باشد"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive باید Boolean باشد"),

  body("freeShipping")
    .optional()
    .isBoolean()
    .withMessage("freeShipping باید Boolean باشد"),

  body("usedCount").not().exists().withMessage("usedCount قابل ارسال نیست"),

  body("userUsage").not().exists().withMessage("userUsage قابل ارسال نیست"),

  handleValidationErrors,
];

// Update Discount
export const updateDiscountValidator = [
  param("id").isMongoId().withMessage("شناسه تخفیف معتبر نیست"),

  body("code")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("کد تخفیف نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 50 })
    .withMessage("کد تخفیف باید بین 3 تا 50 کاراکتر باشد"),

  body("type")
    .optional()
    .isIn(["fixed", "percentage"])
    .withMessage("نوع تخفیف باید fixed یا percentage باشد"),

  body("value")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("مقدار تخفیف باید بیشتر از صفر باشد")
    .custom((value, { req }) => {
      if (req.body.type === "percentage" && Number(value) >= 100) {
        throw new Error("درصد تخفیف باید کمتر از 100 باشد");
      }
      return true;
    }),

  body("minPrice")
    .optional({ values: "null" })
    .isFloat({ min: 0 })
    .withMessage("حداقل مبلغ نمی‌تواند منفی باشد"),

  body("maxPrice")
    .optional({ values: "null" })
    .isFloat({ min: 0 })
    .withMessage("حداکثر مبلغ نمی‌تواند منفی باشد"),

  body("startAt")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("تاریخ شروع معتبر نیست"),

  body("expireAt")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("تاریخ انقضا معتبر نیست"),

  body("usageLimit")
    .optional({ values: "null" })
    .isInt({ min: 1 })
    .withMessage("محدودیت استفاده باید عدد صحیح مثبت باشد"),

  body("userUsedLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("محدودیت استفاده هر کاربر باید عدد صحیح مثبت باشد"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive باید Boolean باشد"),

  body("freeShipping")
    .optional()
    .isBoolean()
    .withMessage("freeShipping باید Boolean باشد"),

  body("usedCount").not().exists().withMessage("usedCount قابل تغییر نیست"),

  body("userUsage").not().exists().withMessage("userUsage قابل تغییر نیست"),

  handleValidationErrors,
];

// Check Discount Code
export const checkDiscountCodeValidator = [
  body("code").trim().notEmpty().withMessage("کد تخفیف الزامی است"),

  handleValidationErrors,
];

// Discount ID
export const discountIdValidator = [
  param("id").isMongoId().withMessage("شناسه تخفیف معتبر نیست"),

  handleValidationErrors,
];
