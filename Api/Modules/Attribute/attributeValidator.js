
import { body, param } from "express-validator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

// Validate attribute ID
const validateId = [
  param("id")
    .isMongoId()
    .withMessage("شناسه ویژگی معتبر نیست."),
];

// Validate localized fields
const validateLocalizedField = (field, required = false) => {
  const rules = [
    body(field)
      .if((value) => required || value !== undefined)
      .exists({ checkNull: true })
      .withMessage(`${field} الزامی است.`)
      .bail()
      .isObject({ strict: true })
      .withMessage(`${field} باید یک شیء باشد.`),

    ...["fa", "en"].map((language) =>
      body(`${field}.${language}`)
        .if(body(field).exists())
        .isString()
        .withMessage(`${field}.${language} باید رشته باشد.`)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(`${field}.${language} الزامی است.`)
        .isLength({ max: 100 })
        .withMessage(`${field}.${language} نباید بیشتر از 100 کاراکتر باشد.`),
    ),
  ];

  return rules;
};

// Validate slug
const validateSlugField = (required = false) => {
  return [
    body("slug")
      .if((value) => required || value !== undefined)
      .exists({ checkNull: true })
      .withMessage("slug الزامی است.")
      .bail()
      .isObject({ strict: true })
      .withMessage("slug باید یک شیء باشد."),

    ...["fa", "en"].map((language) =>
      body(`slug.${language}`)
        .if(body("slug").exists())
        .isString()
        .withMessage(`slug.${language} باید رشته باشد.`)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(`slug.${language} الزامی است.`)
        .isLength({ min: 3, max: 100 })
        .withMessage(`slug.${language} باید بین 3 تا 100 کاراکتر باشد.`)
        .customSanitizer((value) => value.toLowerCase()),
    ),
  ];
};

// Validate attribute type
const validateType = [
  body("type")
    .optional()
    .isIn(["select", "text", "number"])
    .withMessage("نوع ویژگی باید select، text یا number باشد."),
];

// Validate isVariant
const validateIsVariant = [
  body("isVariant")
    .optional()
    .isBoolean()
    .withMessage("isVariant باید boolean باشد.")
    .toBoolean(),
];

// Validate unit
const validateUnit = [
  body("unit")
    .optional()
    .isString()
    .withMessage("واحد اندازه‌گیری باید رشته باشد.")
    .trim(),
];

// Validate values
const validateValues = [
  body("values")
    .optional()
    .isArray()
    .withMessage("مقادیر ویژگی باید آرایه باشند."),

  body("values.*.name")
    .exists()
    .withMessage("نام هر مقدار الزامی است.")
    .bail()
    .isObject({ strict: true })
    .withMessage("نام هر مقدار باید یک شیء باشد."),

  ...["fa", "en"].map((language) =>
    body(`values.*.name.${language}`)
      .isString()
      .withMessage(`نام مقدار به زبان ${language} باید رشته باشد.`)
      .bail()
      .trim()
      .notEmpty()
      .withMessage(`نام مقدار به زبان ${language} الزامی است.`)
      .isLength({ max: 100 })
      .withMessage("نام مقدار نباید بیشتر از 100 کاراکتر باشد."),
  ),

  body("values.*.slug")
    .exists()
    .withMessage("اسلاگ هر مقدار الزامی است.")
    .bail()
    .isObject({ strict: true })
    .withMessage("اسلاگ هر مقدار باید یک شیء باشد."),

  ...["fa", "en"].map((language) =>
    body(`values.*.slug.${language}`)
      .isString()
      .withMessage(`اسلاگ مقدار به زبان ${language} باید رشته باشد.`)
      .bail()
      .trim()
      .notEmpty()
      .withMessage(`اسلاگ مقدار به زبان ${language} الزامی است.`)
      .isLength({ min: 1, max: 100 })
      .withMessage("اسلاگ مقدار باید بین 1 تا 100 کاراکتر باشد.")
      .customSanitizer((value) => value.toLowerCase()),
  ),

  body("values.*.isActive")
    .optional()
    .isBoolean()
    .withMessage("وضعیت فعال‌بودن مقدار باید boolean باشد.")
    .toBoolean(),
];

// Validate other attribute fields
const optionalAttributeFields = [
  ...validateType,
  ...validateIsVariant,
  ...validateUnit,

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("وضعیت فعال‌بودن باید boolean باشد.")
    .toBoolean(),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("ترتیب نمایش باید عدد صحیح و نامنفی باشد.")
    .toInt(),
];

// Validate relationships between fields during creation
const validateCreateRules = [
  body("values").custom((values, { req }) => {
    const type = req.body.type || "select";

    if (!["select", "text", "number"].includes(type)) {
      return true;
    }

    if (type === "select" && (!Array.isArray(values) || values.length === 0)) {
      throw new Error(
        "ویژگی‌های انتخابی باید حداقل یک مقدار داشته باشند.",
      );
    }

    if (
      (type === "text" || type === "number") &&
      values !== undefined &&
      (!Array.isArray(values) || values.length > 0)
    ) {
      throw new Error(
        "ویژگی‌های متنی و عددی نباید مقدار از پیش تعریف‌شده داشته باشند.",
      );
    }

    return true;
  }),

  body("isVariant").custom((value, { req }) => {
    const type = req.body.type || "select";

    if (value && type !== "select") {
      throw new Error(
        "فقط ویژگی‌های انتخابی می‌توانند در ساخت تنوع محصول استفاده شوند.",
      );
    }

    return true;
  }),

  body("unit").custom((value, { req }) => {
    const type = req.body.type || "select";

    if (value && type !== "number") {
      throw new Error(
        "واحد اندازه‌گیری فقط برای ویژگی‌های عددی مجاز است.",
      );
    }

    return true;
  }),
];

// Create
export const validateCreateAttribute = [
  ...validateLocalizedField("name", true),
  ...validateSlugField(true),
  ...optionalAttributeFields,
  ...validateCreateRules,
  ...validateValues,
  handleValidationErrors,
];

// Update
export const validateUpdateAttribute = [
  ...validateId,
  ...validateLocalizedField("name"),
  ...validateSlugField(),
  ...optionalAttributeFields,
  ...validateValues,
  handleValidationErrors,
];

// Get
export const validateGetAttribute = [
  ...validateId,
  handleValidationErrors,
];

// Delete
export const validateDeleteAttribute = [
  ...validateId,
  handleValidationErrors,
];
