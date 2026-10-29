import { body, param } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

const validateLocalizedField = (field, { required = false } = {}) => [
  body(`${field}.fa`)
    .if((value, { req }) => required || req.body[field] !== undefined)
    .exists()
    .withMessage(`${field}.fa is required`)
    .bail()
    .isString()
    .withMessage(`${field}.fa must be a string`)
    .bail()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage(`${field}.fa must be between 3 and 100 characters`),

  body(`${field}.en`)
    .if((value, { req }) => required || req.body[field] !== undefined)
    .exists()
    .withMessage(`${field}.en is required`)
    .bail()
    .isString()
    .withMessage(`${field}.en must be a string`)
    .bail()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage(`${field}.en must be between 3 and 100 characters`),
];

export const validateBrandId = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
  handleValidationErrors,
];

export const validateCreateBrand = [
  body("name").exists().withMessage("name is required").bail().isObject(),
  ...validateLocalizedField("name", { required: true }),

  body("slug").exists().withMessage("slug is required").bail().isObject(),
  ...validateLocalizedField("slug", { required: true }),

  body("description")
    .optional()
    .isObject()
    .withMessage("description must be an object"),

  ...validateLocalizedField("description"),

  body("logo")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("logo must be a string"),

  body("website")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("website must be a valid URL"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  handleValidationErrors,
];

export const validateUpdateBrand = [
  param("id").isMongoId().withMessage("Invalid brand ID"),

  body("name").optional().isObject().withMessage("name must be an object"),

  body("slug").optional().isObject().withMessage("slug must be an object"),

  body("description")
    .optional()
    .isObject()
    .withMessage("description must be an object"),

  ...validateLocalizedField("name"),
  ...validateLocalizedField("slug"),
  ...validateLocalizedField("description"),

  body("logo")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("logo must be a string"),

  body("website")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("website must be a valid URL"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  handleValidationErrors,
];
