import { body, param } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

// Localized title
const titleValidation = [
  body("title.fa")
    .if(body("title").exists())
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان فارسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("title.en")
    .if(body("title").exists())
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان انگلیسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),
];

// Description
const descriptionValidation = [
  body("description.fa")
    .optional()
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("توضیحات فارسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("description.en")
    .optional()
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("توضیحات انگلیسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),
];

// Create Address
export const createAddressValidator = [
  body("title").notEmpty().withMessage("عنوان آدرس الزامی است"),
  ...titleValidation,

  ...descriptionValidation,

  body("city")
    .trim()
    .notEmpty()
    .withMessage("شهر الزامی است")
    .isLength({ min: 2, max: 100 })
    .withMessage("نام شهر باید بین ۲ تا ۱۰۰ کاراکتر باشد"),

  body("province")
    .trim()
    .notEmpty()
    .withMessage("استان الزامی است")
    .isLength({ min: 2, max: 100 })
    .withMessage("نام استان باید بین ۲ تا ۱۰۰ کاراکتر باشد"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("کد پستی الزامی است")
    .matches(/^(?!([0-9])\1{9})[0-9]{10}$/)
    .withMessage("کد پستی باید ۱۰ رقم معتبر باشد"),

  body("receiverFullName")
    .trim()
    .notEmpty()
    .withMessage("نام گیرنده الزامی است")
    .isLength({ min: 3, max: 100 })
    .withMessage("نام گیرنده باید بین ۳ تا ۱۰۰ کاراکتر باشد"),

  body("receiverPhoneNumber")
    .trim()
    .notEmpty()
    .withMessage("شماره موبایل گیرنده الزامی است")
    .matches(/^09\d{9}$/)
    .withMessage("شماره موبایل گیرنده معتبر نیست"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("مقدار isDefault باید Boolean باشد"),

  body("lat")
    .notEmpty()
    .withMessage("عرض جغرافیایی الزامی است")
    .isFloat({ min: -90, max: 90 })
    .withMessage("عرض جغرافیایی معتبر نیست"),

  body("lng")
    .notEmpty()
    .withMessage("طول جغرافیایی الزامی است")
    .isFloat({ min: -180, max: 180 })
    .withMessage("طول جغرافیایی معتبر نیست"),

  body("userId").not().exists().withMessage("ارسال شناسه کاربر مجاز نیست"),

  handleValidationErrors,
];

// Update Address
export const updateAddressValidator = [
  param("id").isMongoId().withMessage("شناسه آدرس معتبر نیست"),

  ...titleValidation,
  ...descriptionValidation,

  body("city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("نام شهر باید بین ۲ تا ۱۰۰ کاراکتر باشد"),

  body("province")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("نام استان باید بین ۲ تا ۱۰۰ کاراکتر باشد"),

  body("postalCode")
    .optional()
    .trim()
    .matches(/^(?!([0-9])\1{9})[0-9]{10}$/)
    .withMessage("کد پستی باید ۱۰ رقم معتبر باشد"),

  body("receiverFullName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("نام گیرنده باید بین ۳ تا ۱۰۰ کاراکتر باشد"),

  body("receiverPhoneNumber")
    .optional()
    .trim()
    .matches(/^09\d{9}$/)
    .withMessage("شماره موبایل گیرنده معتبر نیست"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("مقدار isDefault باید Boolean باشد"),

  body("lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("عرض جغرافیایی معتبر نیست"),

  body("lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("طول جغرافیایی معتبر نیست"),

  body("userId").not().exists().withMessage("ارسال شناسه کاربر مجاز نیست"),

  handleValidationErrors,
];

// Address ID
export const addressIdValidator = [
  param("id").isMongoId().withMessage("شناسه آدرس معتبر نیست"),
  handleValidationErrors,
];
