import { body, param, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "اطلاعات ارسالی معتبر نیست",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

// Create Slider Validator
export const createSliderValidator = [
  body("title")
    .exists()
    .withMessage("عنوان اسلایدر الزامی است")
    .isObject()
    .withMessage("عنوان اسلایدر باید یک شیء باشد"),

  body("title.fa")
    .exists()
    .withMessage("عنوان فارسی الزامی است")
    .bail()
    .isString()
    .withMessage("عنوان فارسی باید متن باشد")
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان فارسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("title.en")
    .exists()
    .withMessage("عنوان انگلیسی الزامی است")
    .bail()
    .isString()
    .withMessage("عنوان انگلیسی باید متن باشد")
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان انگلیسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("image")
    .exists()
    .withMessage("تصویر اسلایدر الزامی است")
    .bail()
    .isString()
    .withMessage("آدرس تصویر باید متن باشد")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("آدرس تصویر نمی‌تواند خالی باشد"),

  body("href")
    .optional()
    .isString()
    .withMessage("لینک اسلایدر باید متن باشد")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("لینک اسلایدر نمی‌تواند خالی باشد"),

  body("path")
    .exists()
    .withMessage("مسیر اسلایدر الزامی است")
    .bail()
    .isString()
    .withMessage("مسیر اسلایدر باید متن باشد")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("مسیر اسلایدر نمی‌تواند خالی باشد"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("وضعیت انتشار باید true یا false باشد")
    .toBoolean(),

  handleValidationErrors,
];

// Update Slider Validator
export const updateSliderValidator = [
  param("id").isMongoId().withMessage("شناسه اسلایدر معتبر نیست"),

  body("title")
    .optional()
    .isObject()
    .withMessage("عنوان اسلایدر باید یک شیء باشد"),

  body("title.fa")
    .if(body("title").exists())
    .exists()
    .withMessage("عنوان فارسی الزامی است")
    .bail()
    .isString()
    .withMessage("عنوان فارسی باید متن باشد")
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان فارسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("title.en")
    .if(body("title").exists())
    .exists()
    .withMessage("عنوان انگلیسی الزامی است")
    .bail()
    .isString()
    .withMessage("عنوان انگلیسی باید متن باشد")
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان انگلیسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("image")
    .optional()
    .isString()
    .withMessage("آدرس تصویر باید متن باشد")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("آدرس تصویر نمی‌تواند خالی باشد"),

  body("href")
    .optional()
    .isString()
    .withMessage("لینک اسلایدر باید متن باشد")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("لینک اسلایدر نمی‌تواند خالی باشد"),

  body("path")
    .optional()
    .isString()
    .withMessage("مسیر اسلایدر باید متن باشد")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("مسیر اسلایدر نمی‌تواند خالی باشد"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("وضعیت انتشار باید true یا false باشد")
    .toBoolean(),

  handleValidationErrors,
];

// Slider ID Validator
export const sliderIdValidator = [
  param("id").isMongoId().withMessage("شناسه اسلایدر معتبر نیست"),

  handleValidationErrors,
];
