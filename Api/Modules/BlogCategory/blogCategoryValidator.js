import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

// اعتبارسنجی شناسه دسته‌بندی
const validateId = [
  param("id")
    .isMongoId()
    .withMessage("شناسه دسته‌بندی معتبر نیست."),
];

// اعتبارسنجی نام دسته‌بندی
const validateName = [
  body("name")
    .exists()
    .withMessage("نام دسته‌بندی الزامی است.")
    .bail()
    .isObject()
    .withMessage("نام دسته‌بندی باید یک شیء چندزبانه باشد."),

  body("name.fa")
    .if(body("name").exists())
    .notEmpty()
    .withMessage("نام فارسی الزامی است.")
    .bail()
    .isString()
    .withMessage("نام فارسی باید رشته باشد.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("نام فارسی باید بین ۳ تا ۱۵۰ کاراکتر باشد."),

  body("name.en")
    .if(body("name").exists())
    .notEmpty()
    .withMessage("نام انگلیسی الزامی است.")
    .bail()
    .isString()
    .withMessage("نام انگلیسی باید رشته باشد.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("نام انگلیسی باید بین ۳ تا ۱۵۰ کاراکتر باشد."),
];

// اعتبارسنجی اسلاگ دسته‌بندی
const validateSlug = [
  body("slug")
    .exists()
    .withMessage("اسلاگ دسته‌بندی الزامی است.")
    .bail()
    .isObject()
    .withMessage("اسلاگ باید یک شیء چندزبانه باشد."),

  body("slug.fa")
    .if(body("slug").exists())
    .notEmpty()
    .withMessage("اسلاگ فارسی الزامی است.")
    .bail()
    .isString()
    .withMessage("اسلاگ فارسی باید رشته باشد.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 180 })
    .withMessage("اسلاگ فارسی باید بین ۳ تا ۱۸۰ کاراکتر باشد."),

  body("slug.en")
    .if(body("slug").exists())
    .notEmpty()
    .withMessage("اسلاگ انگلیسی الزامی است.")
    .bail()
    .isString()
    .withMessage("اسلاگ انگلیسی باید رشته باشد.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 180 })
    .withMessage("اسلاگ انگلیسی باید بین ۳ تا ۱۸۰ کاراکتر باشد."),
];

// اعتبارسنجی توضیحات دسته‌بندی
const validateDescription = [
  body("description")
    .optional()
    .isObject()
    .withMessage("توضیحات باید یک شیء چندزبانه باشد."),

  body("description.fa")
    .optional()
    .isString()
    .withMessage("توضیحات فارسی باید رشته باشد.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("توضیحات فارسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد."),

  body("description.en")
    .optional()
    .isString()
    .withMessage("توضیحات انگلیسی باید رشته باشد.")
    .bail()
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("توضیحات انگلیسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد."),
];

// اعتبارسنجی آدرس تصویر
const validateImage = [
  body("image")
    .optional()
    .isString()
    .withMessage("آدرس تصویر باید رشته باشد.")
    .bail()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("آدرس تصویر نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد."),
];

// اعتبارسنجی شناسه دسته والد
const validateParentId = [
  body("parentId")
    .optional({ values: "null" })
    .isMongoId()
    .withMessage("شناسه دسته والد معتبر نیست."),
];

// اعتبارسنجی وضعیت فعال بودن
const validateIsActive = [
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("وضعیت فعال بودن باید مقدار بولی باشد.")
    .toBoolean(),
];

// اعتبارسنجی ترتیب نمایش
const validateDisplayOrder = [
  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ترتیب نمایش باید یک عدد صحیح و غیرمنفی باشد.")
    .toInt(),
];

// اعتبارسنجی فیلترهای دریافت دسته‌بندی‌ها
const validateQuery = [
  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("فیلتر وضعیت فعال بودن معتبر نیست."),

  query("parentId")
    .optional()
    .custom((value) => {
      if (value === "null") return true;

      return /^[0-9a-fA-F]{24}$/.test(value);
    })
    .withMessage("شناسه دسته والد معتبر نیست."),
];

// ایجاد دسته‌بندی
export const validateCreateBlogCategory = [
  ...validateName,
  ...validateSlug,
  ...validateDescription,
  ...validateImage,
  ...validateParentId,
  ...validateDisplayOrder,
  handleValidationErrors,
];

// ویرایش دسته‌بندی
export const validateUpdateBlogCategory = [
  ...validateId,
  ...validateName.map((validator) => validator),
  ...validateSlug.map((validator) => validator),
  ...validateDescription,
  ...validateImage,
  ...validateParentId,
  ...validateIsActive,
  ...validateDisplayOrder,
  handleValidationErrors,
];

// دریافت یک دسته‌بندی
export const validateGetBlogCategory = [
  ...validateId,
  handleValidationErrors,
];

// دریافت تمام دسته‌بندی‌ها
export const validateGetAllBlogCategories = [
  ...validateQuery,
  handleValidationErrors,
];

// حذف دسته‌بندی
export const validateRemoveBlogCategory = [
  ...validateId,
  handleValidationErrors,
];
