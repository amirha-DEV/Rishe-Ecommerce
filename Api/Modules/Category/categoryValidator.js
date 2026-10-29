import { body, param } from "express-validator";
import mongoose from "mongoose";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

const validateId = [
  param("id").isMongoId().withMessage("شناسه دسته‌بندی معتبر نیست."),
];

const validateLocalizedField = (field, required = false) => {
  const rules = [];

  for (const language of ["fa", "en"]) {
    const fieldPath = `${field}.${language}`;

    let validator = body(fieldPath);

    if (required) {
      validator = validator.notEmpty().withMessage(`${fieldPath} الزامی است.`);
    } else {
      validator = validator.optional({ nullable: true });
    }

    rules.push(
      validator
        .isString()
        .withMessage(`${fieldPath} باید رشته باشد.`)
        .trim()
        .isLength({ max: 100 })
        .withMessage(`${fieldPath} نباید بیشتر از 100 کاراکتر باشد.`),
    );
  }

  return rules;
};

const validateSlugField = () => {
  const rules = [];

  for (const language of ["fa", "en"]) {
    const fieldPath = `slug.${language}`;

    rules.push(
      body(fieldPath)
        .notEmpty()
        .withMessage(`${fieldPath} الزامی است.`)
        .isString()
        .withMessage(`${fieldPath} باید رشته باشد.`)
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage(`${fieldPath} باید بین 3 تا 100 کاراکتر باشد.`)
        .customSanitizer((value) => value.toLowerCase()),
    );
  }

  return rules;
};

const validateOptionalSlugField = () => {
  const rules = [];

  for (const language of ["fa", "en"]) {
    const fieldPath = `slug.${language}`;

    rules.push(
      body(fieldPath)
        .optional()
        .isString()
        .withMessage(`${fieldPath} باید رشته باشد.`)
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage(`${fieldPath} باید بین 3 تا 100 کاراکتر باشد.`)
        .customSanitizer((value) => value.toLowerCase()),
    );
  }

  return rules;
};

const optionalCategoryFields = [
  body("parentId")
    .optional({ nullable: true })
    .custom((value) => value === "" || mongoose.isValidObjectId(value))
    .withMessage("شناسه دسته‌بندی والد معتبر نیست."),

  body("image")
    .optional()
    .isString()
    .withMessage("تصویر باید رشته باشد.")
    .trim(),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ترتیب نمایش باید عدد صحیح و نامنفی باشد.")
    .toInt(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("وضعیت فعال‌بودن باید boolean باشد.")
    .toBoolean(),
];

export const validateCreateCategory = [
  ...validateLocalizedField("name", true),
  ...validateSlugField(),
  ...validateLocalizedField("description"),
  ...optionalCategoryFields,
  handleValidationErrors,
];

export const validateUpdateCategory = [
  ...validateId,
  ...validateLocalizedField("name"),
  ...validateOptionalSlugField(),
  ...validateLocalizedField("description"),
  ...optionalCategoryFields,
  handleValidationErrors,
];

export const validateGetCategory = [...validateId, handleValidationErrors];

export const validateDeleteCategory = [...validateId, handleValidationErrors];
