
import { body, param } from "express-validator";

export const productIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("شناسه محصول معتبر نیست"),
];

export const createProductValidator = [
  body("brandId")
    .notEmpty()
    .withMessage("برند محصول الزامی است")
    .isMongoId()
    .withMessage("شناسه برند معتبر نیست"),

  body("categoryIds")
    .isArray({ min: 1 })
    .withMessage("محصول باید حداقل یک دسته‌بندی داشته باشد"),

  body("categoryIds.*")
    .isMongoId()
    .withMessage("شناسه دسته‌بندی معتبر نیست"),

  body("title")
    .isObject()
    .withMessage("عنوان محصول باید شامل عنوان فارسی و انگلیسی باشد"),

  body("title.fa")
    .isString()
    .withMessage("عنوان فارسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("عنوان فارسی الزامی است")
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان فارسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("title.en")
    .isString()
    .withMessage("عنوان انگلیسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("عنوان انگلیسی الزامی است")
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان انگلیسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("description")
    .optional()
    .isObject()
    .withMessage("توضیحات باید یک شیء شامل fa و en باشد"),

  body("description.fa")
    .optional()
    .isString()
    .withMessage("توضیحات فارسی باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("توضیحات فارسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("description.en")
    .optional()
    .isString()
    .withMessage("توضیحات انگلیسی باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("توضیحات انگلیسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("details")
    .optional()
    .isObject()
    .withMessage("جزئیات باید یک شیء شامل fa و en باشد"),

  body("details.fa")
    .optional()
    .isString()
    .withMessage("جزئیات فارسی باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("جزئیات فارسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("details.en")
    .optional()
    .isString()
    .withMessage("جزئیات انگلیسی باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("جزئیات انگلیسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("slug")
    .isObject()
    .withMessage("اسلاگ باید شامل مقدار فارسی و انگلیسی باشد"),

  body("slug.fa")
    .isString()
    .withMessage("اسلاگ فارسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("اسلاگ فارسی الزامی است")
    .isLength({ min: 3, max: 180 })
    .withMessage("اسلاگ فارسی باید بین ۳ تا ۱۸۰ کاراکتر باشد"),

  body("slug.en")
    .isString()
    .withMessage("اسلاگ انگلیسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("اسلاگ انگلیسی الزامی است")
    .isLength({ min: 3, max: 180 })
    .withMessage("اسلاگ انگلیسی باید بین ۳ تا ۱۸۰ کاراکتر باشد"),

  body("images")
    .optional()
    .isArray()
    .withMessage("تصاویر باید آرایه باشند"),

  body("images.*")
    .isString()
    .withMessage("آدرس هر تصویر باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("آدرس تصویر نمی‌تواند خالی باشد"),

  body("videos")
    .optional()
    .isArray()
    .withMessage("ویدیوها باید آرایه باشند"),

  body("videos.*")
    .isString()
    .withMessage("آدرس هر ویدیو باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("آدرس ویدیو نمی‌تواند خالی باشد"),

  body("information")
    .optional()
    .isArray()
    .withMessage("مشخصات محصول باید آرایه باشند"),

  body("information.*.key")
    .isObject()
    .withMessage("عنوان مشخصات باید شامل fa و en باشد"),

  body("information.*.key.fa")
    .optional()
    .isString()
    .withMessage("عنوان فارسی مشخصات باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("عنوان فارسی مشخصات باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("information.*.key.en")
    .optional()
    .isString()
    .withMessage("عنوان انگلیسی مشخصات باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("عنوان انگلیسی مشخصات باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("information.*.value")
    .isObject()
    .withMessage("مقدار مشخصات باید شامل fa و en باشد"),

  body("information.*.value.fa")
    .optional()
    .isString()
    .withMessage("مقدار فارسی مشخصات باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("مقدار فارسی مشخصات باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("information.*.value.en")
    .optional()
    .isString()
    .withMessage("مقدار انگلیسی مشخصات باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("مقدار انگلیسی مشخصات باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("tags")
    .optional()
    .isObject()
    .withMessage("تگ‌ها باید شامل آرایه‌های fa و en باشند"),

  body("tags.fa")
    .optional()
    .isArray()
    .withMessage("تگ‌های فارسی باید آرایه باشند"),

  body("tags.fa.*")
    .isString()
    .withMessage("هر تگ فارسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("تگ فارسی نمی‌تواند خالی باشد"),

  body("tags.en")
    .optional()
    .isArray()
    .withMessage("تگ‌های انگلیسی باید آرایه باشند"),

  body("tags.en.*")
    .isString()
    .withMessage("هر تگ انگلیسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("تگ انگلیسی نمی‌تواند خالی باشد"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("وضعیت انتشار باید بولی باشد"),

  body("seoId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("شناسه سئو معتبر نیست"),
];

export const updateProductValidator = [
  body("brandId")
    .optional()
    .isMongoId()
    .withMessage("شناسه برند معتبر نیست"),

  body("categoryIds")
    .optional()
    .isArray({ min: 1 })
    .withMessage("دسته‌بندی‌ها باید آرایه‌ای با حداقل یک مورد باشند"),

  body("categoryIds.*")
    .isMongoId()
    .withMessage("شناسه دسته‌بندی معتبر نیست"),

  body("title")
    .optional()
    .isObject()
    .withMessage("عنوان محصول باید شیء باشد"),

  body("title.fa")
    .optional()
    .isString()
    .withMessage("عنوان فارسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("عنوان فارسی نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان فارسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("title.en")
    .optional()
    .isString()
    .withMessage("عنوان انگلیسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("عنوان انگلیسی نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 150 })
    .withMessage("عنوان انگلیسی باید بین ۳ تا ۱۵۰ کاراکتر باشد"),

  body("description")
    .optional()
    .isObject()
    .withMessage("توضیحات باید شیء باشد"),

  body("description.fa")
    .optional()
    .isString()
    .withMessage("توضیحات فارسی باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("توضیحات فارسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("description.en")
    .optional()
    .isString()
    .withMessage("توضیحات انگلیسی باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("توضیحات انگلیسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("details")
    .optional()
    .isObject()
    .withMessage("جزئیات باید شیء باشد"),

  body("details.fa")
    .optional()
    .isString()
    .withMessage("جزئیات فارسی باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("جزئیات فارسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("details.en")
    .optional()
    .isString()
    .withMessage("جزئیات انگلیسی باید رشته باشد")
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage("جزئیات انگلیسی باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("slug")
    .optional()
    .isObject()
    .withMessage("اسلاگ باید شیء باشد"),

  body("slug.fa")
    .optional()
    .isString()
    .withMessage("اسلاگ فارسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("اسلاگ فارسی نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 180 })
    .withMessage("اسلاگ فارسی باید بین ۳ تا ۱۸۰ کاراکتر باشد"),

  body("slug.en")
    .optional()
    .isString()
    .withMessage("اسلاگ انگلیسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("اسلاگ انگلیسی نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 180 })
    .withMessage("اسلاگ انگلیسی باید بین ۳ تا ۱۸۰ کاراکتر باشد"),

  body("images")
    .optional()
    .isArray()
    .withMessage("تصاویر باید آرایه باشند"),

  body("images.*")
    .isString()
    .withMessage("آدرس هر تصویر باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("آدرس تصویر نمی‌تواند خالی باشد"),

  body("videos")
    .optional()
    .isArray()
    .withMessage("ویدیوها باید آرایه باشند"),

  body("videos.*")
    .isString()
    .withMessage("آدرس هر ویدیو باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("آدرس ویدیو نمی‌تواند خالی باشد"),

  body("information")
    .optional()
    .isArray()
    .withMessage("مشخصات محصول باید آرایه باشند"),

  body("information.*.key")
    .optional()
    .isObject()
    .withMessage("عنوان مشخصات باید شیء باشد"),

  body("information.*.key.fa")
    .optional()
    .isString()
    .withMessage("عنوان فارسی مشخصات باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("عنوان فارسی مشخصات نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 5000 })
    .withMessage("عنوان فارسی مشخصات باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("information.*.key.en")
    .optional()
    .isString()
    .withMessage("عنوان انگلیسی مشخصات باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("عنوان انگلیسی مشخصات نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 5000 })
    .withMessage("عنوان انگلیسی مشخصات باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("information.*.value")
    .optional()
    .isObject()
    .withMessage("مقدار مشخصات باید شیء باشد"),

  body("information.*.value.fa")
    .optional()
    .isString()
    .withMessage("مقدار فارسی مشخصات باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("مقدار فارسی مشخصات نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 5000 })
    .withMessage("مقدار فارسی مشخصات باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("information.*.value.en")
    .optional()
    .isString()
    .withMessage("مقدار انگلیسی مشخصات باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("مقدار انگلیسی مشخصات نمی‌تواند خالی باشد")
    .isLength({ min: 3, max: 5000 })
    .withMessage("مقدار انگلیسی مشخصات باید بین ۳ تا ۵۰۰۰ کاراکتر باشد"),

  body("tags")
    .optional()
    .isObject()
    .withMessage("تگ‌ها باید شیء باشند"),

  body("tags.fa")
    .optional()
    .isArray()
    .withMessage("تگ‌های فارسی باید آرایه باشند"),

  body("tags.fa.*")
    .isString()
    .withMessage("هر تگ فارسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("تگ فارسی نمی‌تواند خالی باشد"),

  body("tags.en")
    .optional()
    .isArray()
    .withMessage("تگ‌های انگلیسی باید آرایه باشند"),

  body("tags.en.*")
    .isString()
    .withMessage("هر تگ انگلیسی باید رشته باشد")
    .trim()
    .notEmpty()
    .withMessage("تگ انگلیسی نمی‌تواند خالی باشد"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("وضعیت انتشار باید بولی باشد"),

  body("seoId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("شناسه سئو معتبر نیست"),
];
