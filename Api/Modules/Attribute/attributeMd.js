import mongoose from "mongoose";
import { localizedSchema } from "../Product/productMd.js";

const attributeValueSchema = new mongoose.Schema(
  {
    name: {
      type: localizedSchema,
      required: [true, "مقدار ویژگی الزامی است."],
    },
    slug: {
      fa: {
        type: String,
        required: [true, "اسلاگ فارسی مقدار الزامی است."],
        trim: true,
        lowercase: true,
        minlength: [1, "اسلاگ فارسی نمی‌تواند خالی باشد."],
        maxlength: [100, "اسلاگ فارسی نمی‌تواند بیشتر از 100 کاراکتر باشد."],
      },
      en: {
        type: String,
        required: [true, "English value slug is required."],
        trim: true,
        lowercase: true,
        minlength: [1, "English slug cannot be empty."],
        maxlength: [100, "English slug cannot exceed 100 characters."],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

// Check for duplicate names and slugs within an attribute
const validateUniqueValues = (values) => {
  const faNames = new Set();
  const enNames = new Set();
  const faSlugs = new Set();
  const enSlugs = new Set();

  for (const value of values) {
    const nameFa = value.name?.fa?.trim().toLowerCase();
    const nameEn = value.name?.en?.trim().toLowerCase();
    const slugFa = value.slug?.fa?.trim().toLowerCase();
    const slugEn = value.slug?.en?.trim().toLowerCase();

    if (
      (nameFa && faNames.has(nameFa)) ||
      (nameEn && enNames.has(nameEn)) ||
      (slugFa && faSlugs.has(slugFa)) ||
      (slugEn && enSlugs.has(slugEn))
    ) {
      return false;
    }

    if (nameFa) faNames.add(nameFa);
    if (nameEn) enNames.add(nameEn);
    if (slugFa) faSlugs.add(slugFa);
    if (slugEn) enSlugs.add(slugEn);
  }

  return true;
};

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: localizedSchema,
      required: [true, "نام ویژگی الزامی است."],
    },
    slug: {
      fa: {
        type: String,
        required: [true, "اسلاگ فارسی الزامی است."],
        trim: true,
        lowercase: true,
        minlength: [3, "اسلاگ فارسی نمی‌تواند کمتر از 3 کاراکتر باشد."],
        maxlength: [100, "اسلاگ فارسی نمی‌تواند بیشتر از 100 کاراکتر باشد."],
      },
      en: {
        type: String,
        required: [true, "English slug is required."],
        trim: true,
        lowercase: true,
        minlength: [3, "English slug cannot be less than 3 characters."],
        maxlength: [100, "English slug cannot exceed 100 characters."],
      },
    },
    type: {
      type: String,
      enum: {
        values: ["select", "text", "number"],
        message: "نوع ویژگی معتبر نیست.",
      },
      default: "select",
      required: [true, "نوع ویژگی الزامی است."],
    },
    isVariant: {
      type: Boolean,
      default: false,
    },
    unit: {
      type: String,
      trim: true,
      default: "",
    },
    values: {
      type: [attributeValueSchema],
      default: [],
      validate: {
        validator: validateUniqueValues,
        message: "مقادیر ویژگی نباید تکراری باشند.",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: [0, "ترتیب نمایش نمی‌تواند منفی باشد."],
      validate: {
        validator: Number.isInteger,
        message: "ترتیب نمایش باید عدد صحیح باشد.",
      },
    },
  },
  { timestamps: true },
);

// Validate attribute rules before document validation
attributeSchema.pre("validate", function () {
  const valuesCount = this.values?.length ?? 0;

  if (this.type === "select" && valuesCount === 0) {
    this.invalidate(
      "values",
      "ویژگی‌های انتخابی باید حداقل یک مقدار داشته باشند.",
    );
  }
  if (
    (this.type === "text" || this.type === "number") &&
    valuesCount > 0
  ) {
    this.invalidate(
      "values",
      "ویژگی‌های متنی و عددی نباید مقدار از پیش تعریف‌شده داشته باشند.",
    );
  }
  if (this.type !== "select" && this.isVariant) {
    this.invalidate(
      "isVariant",
      "فقط ویژگی‌های انتخابی می‌توانند در ساخت تنوع محصول استفاده شوند.",
    );
  }
  if (this.type !== "number" && this.unit) {
    this.invalidate(
      "unit",
      "واحد اندازه‌گیری فقط برای ویژگی‌های عددی مجاز است.",
    );
  }
});

attributeSchema.index({ "slug.fa": 1 }, { unique: true });
attributeSchema.index({ "slug.en": 1 }, { unique: true });
attributeSchema.index({ isActive: 1, displayOrder: 1 });

const Attribute = mongoose.model("Attribute", attributeSchema);

export default Attribute;
