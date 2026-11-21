
import { body, param, query } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

// Validate variant ID
const validateId = [
  param("id")
    .isMongoId()
    .withMessage("شناسه تنوع محصول معتبر نیست."),
];

// Validate product ID
const validateProductId = [
  query("productId")
    .isMongoId()
    .withMessage("شناسه محصول معتبر نیست."),
];

// Validate attributes
const validateAttributes = [
  body("attributes")
    .optional({ values: "undefined" })
    .isArray()
    .withMessage("ویژگی‌های تنوع باید آرایه باشند."),

  body("attributes.*")
    .custom((item) => {
      return (
        item !== null &&
        typeof item === "object" &&
        !Array.isArray(item)
      );
    })
    .withMessage("ساختار ویژگی تنوع معتبر نیست."),

  body("attributes.*.attributeId")
    .isMongoId()
    .withMessage("شناسه ویژگی معتبر نیست."),

  body("attributes.*.valueId")
    .isMongoId()
    .withMessage("شناسه مقدار ویژگی معتبر نیست."),
];

// Validate details
const validateDetails = [
  body("details")
    .optional({ values: "undefined" })
    .isArray()
    .withMessage("مشخصات وابسته باید آرایه باشند."),

  body("details.*")
    .custom((item) => {
      return (
        item !== null &&
        typeof item === "object" &&
        !Array.isArray(item)
      );
    })
    .withMessage("ساختار مشخصات وابسته معتبر نیست."),

  body("details.*.attributeId")
    .isMongoId()
    .withMessage("شناسه ویژگی وابسته معتبر نیست."),

  body("details.*.value")
    .custom((value) => {
      if (typeof value === "number") {
        return Number.isFinite(value);
      }

      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      return false;
    })
    .withMessage("مقدار ویژگی وابسته معتبر نیست."),
];

// Validate price
const validatePrice = (required = false) => {
  return [
    body("price")
      .if((value) => required || value !== undefined)
      .exists({ checkNull: true })
      .withMessage("قیمت الزامی است.")
      .bail()
      .custom((value) => {
        return (
          typeof value === "number" &&
          Number.isFinite(value) &&
          value >= 0
        );
      })
      .withMessage("قیمت باید عددی معتبر و غیرمنفی باشد."),
  ];
};

// Validate stock
const validateStock = [
  body("stock")
    .optional({ values: "undefined" })
    .custom((value) => {
      return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0
      );
    })
    .withMessage("موجودی باید عدد صحیح و غیرمنفی باشد."),
];

// Validate Boolean fields
const validateBooleanFields = [
  body("isMadeToOrder")
    .optional({ values: "undefined" })
    .isBoolean({ strict: true })
    .withMessage("isMadeToOrder باید مقدار Boolean داشته باشد."),

  body("isActive")
    .optional({ values: "undefined" })
    .isBoolean({ strict: true })
    .withMessage("isActive باید مقدار Boolean داشته باشد."),
];

// Validate create fields
const validateCreateFields = [
  body("productId")
    .isMongoId()
    .withMessage("شناسه محصول معتبر نیست."),

  ...validateAttributes,
  ...validateDetails,
  ...validatePrice(true),
  ...validateStock,
  ...validateBooleanFields,
];

// Validate update fields
const validateUpdateFields = [
  ...validateAttributes,
  ...validateDetails,
  ...validatePrice(),
  ...validateStock,
  ...validateBooleanFields,
];

// Validate create
export const validateCreateProductVariant = [
  ...validateCreateFields,
  handleValidationErrors,
];

// Validate update
export const validateUpdateProductVariant = [
  ...validateId,
  ...validateUpdateFields,
  handleValidationErrors,
];

// Validate get one
export const validateGetProductVariant = [
  ...validateId,
  handleValidationErrors,
];

// Validate delete
export const validateDeleteProductVariant = [
  ...validateId,
  handleValidationErrors,
];

// Validate get all
export const validateGetProductVariants = [
  ...validateProductId,
  handleValidationErrors,
];
