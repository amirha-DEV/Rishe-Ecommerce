
import { body, param, query } from "express-validator";

import { handleValidationErrors } from "../../Utils/handleValidationError.js";

// بررسی معتبر بودن شناسه مقاله
const idRules = [
  param("id")
    .isMongoId()
    .withMessage("شناسه مقاله معتبر نیست."),
];

// بررسی ساختار عنوان فارسی و انگلیسی
const titleRules = (required = false) => [
  body("title")
    .if((value, { req }) => required || req.body.title !== undefined)
    .isObject()
    .withMessage("عنوان مقاله باید یک شیء معتبر باشد."),

  body("title.fa")
    .if((value, { req }) => required || req.body.title !== undefined)
    .trim()
    .notEmpty()
    .withMessage("عنوان فارسی مقاله الزامی است."),

  body("title.en")
    .if((value, { req }) => required || req.body.title !== undefined)
    .trim()
    .notEmpty()
    .withMessage("عنوان انگلیسی مقاله الزامی است."),
];

// بررسی ساختار محتوای فارسی و انگلیسی
const detailsRules = (required = false) => [
  body("details")
    .if((value, { req }) => required || req.body.details !== undefined)
    .isObject()
    .withMessage("محتوای مقاله باید یک شیء معتبر باشد."),

  body("details.fa")
    .if((value, { req }) => required || req.body.details !== undefined)
    .trim()
    .notEmpty()
    .withMessage("محتوای فارسی مقاله الزامی است."),

  body("details.en")
    .if((value, { req }) => required || req.body.details !== undefined)
    .trim()
    .notEmpty()
    .withMessage("محتوای انگلیسی مقاله الزامی است."),
];

// بررسی ساختار اسلاگ فارسی و انگلیسی
const slugRules = (required = false) => [
  body("slug")
    .if((value, { req }) => required || req.body.slug !== undefined)
    .isObject()
    .withMessage("اسلاگ مقاله باید یک شیء معتبر باشد."),

  body("slug.fa")
    .if((value, { req }) => required || req.body.slug !== undefined)
    .trim()
    .matches(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u)
    .withMessage("اسلاگ فارسی معتبر نیست."),

  body("slug.en")
    .if((value, { req }) => required || req.body.slug !== undefined)
    .trim()
    .matches(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u)
    .withMessage("اسلاگ انگلیسی معتبر نیست."),
];

// بررسی اطلاعات سئو
const seoRules = [
  body("seo")
    .optional()
    .isObject()
    .withMessage("اطلاعات سئو باید یک شیء معتبر باشد."),

  body("seo.fa")
    .optional()
    .isObject()
    .withMessage("اطلاعات سئوی فارسی معتبر نیست."),

  body("seo.en")
    .optional()
    .isObject()
    .withMessage("اطلاعات سئوی انگلیسی معتبر نیست."),

  body("seo.fa.metaTitle")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 70 })
    .withMessage("عنوان سئوی فارسی نباید بیشتر از 70 کاراکتر باشد."),

  body("seo.en.metaTitle")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 70 })
    .withMessage("عنوان سئوی انگلیسی نباید بیشتر از 70 کاراکتر باشد."),

  body("seo.fa.metaDescription")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 170 })
    .withMessage("توضیحات سئوی فارسی نباید بیشتر از 170 کاراکتر باشد."),

  body("seo.en.metaDescription")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 170 })
    .withMessage("توضیحات سئوی انگلیسی نباید بیشتر از 170 کاراکتر باشد."),

  body("seo.fa.focusKeyword")
    .optional()
    .isString()
    .trim()
    .withMessage("کلمه کلیدی فارسی معتبر نیست."),

  body("seo.en.focusKeyword")
    .optional()
    .isString()
    .trim()
    .withMessage("کلمه کلیدی انگلیسی معتبر نیست."),
];

// بررسی فیلدهای اختیاری مقاله
const optionalFieldsRules = [
  body("description")
    .optional()
    .isObject()
    .withMessage("توضیحات مقاله باید یک شیء معتبر باشد."),

  body("description.fa")
    .optional()
    .isString()
    .trim()
    .withMessage("توضیحات فارسی معتبر نیست."),

  body("description.en")
    .optional()
    .isString()
    .trim()
    .withMessage("توضیحات انگلیسی معتبر نیست."),

  body("image")
    .optional()
    .isString()
    .trim()
    .withMessage("آدرس تصویر مقاله معتبر نیست."),

  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("شناسه دسته‌بندی معتبر نیست."),

  body("tags")
    .optional()
    .isArray()
    .withMessage("برچسب‌های مقاله باید به‌صورت آرایه ارسال شوند."),

  body("tags.*")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("هر برچسب باید یک رشته معتبر باشد."),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("وضعیت انتشار باید Boolean باشد."),
];

// اعتبارسنجی ایجاد مقاله
export const validateCreate = [
  ...titleRules(true),
  ...detailsRules(true),
  ...slugRules(true),

  body("categoryId")
    .notEmpty()
    .withMessage("دسته‌بندی مقاله الزامی است.")
    .bail()
    .isMongoId()
    .withMessage("شناسه دسته‌بندی معتبر نیست."),

  ...optionalFieldsRules,
  ...seoRules,

  handleValidationErrors,
];

// اعتبارسنجی ویرایش مقاله
export const validateUpdate = [
  ...idRules,

  ...titleRules(),
  ...detailsRules(),
  ...slugRules(),

  ...optionalFieldsRules,
  ...seoRules,

  handleValidationErrors,
];

// اعتبارسنجی فیلترهای دریافت مقالات
export const validateGetAll = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("شماره صفحه باید عددی بزرگ‌تر از صفر باشد."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("تعداد مقالات در هر صفحه باید بین 1 تا 100 باشد."),

  query("categoryId")
    .optional()
    .isMongoId()
    .withMessage("شناسه دسته‌بندی معتبر نیست."),

  query("isPublished")
    .optional()
    .isIn(["true", "false"])
    .withMessage("وضعیت انتشار معتبر نیست."),

  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("عبارت جست‌وجو معتبر نیست."),

  handleValidationErrors,
];

// اعتبارسنجی شناسه برای دریافت یک مقاله
export const validateGetById = [
  ...idRules,
  handleValidationErrors,
];

// اعتبارسنجی شناسه برای حذف مقاله
export const validateRemove = [
  ...idRules,
  handleValidationErrors,
];
