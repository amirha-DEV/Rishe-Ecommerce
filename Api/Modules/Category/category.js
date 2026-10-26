import mongoose from "mongoose";

const localizedSchema = new mongoose.Schema(
  {
    fa: {
      type: String,
      required: [true, "نام فارسی الزامی است."],
      trim: true,
      maxlength: [100, "نام فارسی نمی‌تواند بیشتر از 100 کاراکتر باشد."],
    },
    en: {
      type: String,
      required: [true, "نام انگلیسی الزامی است."],
      trim: true,
      maxlength: [100, "نام انگلیسی نمی‌تواند بیشتر از 100 کاراکتر باشد."],
    },
  },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: localizedSchema,
      required: [true, "نام دسته‌بندی الزامی است."],
    },
    slug: {
      fa: {
        type: String,
        required: [true, "اسلاگ فارسی الزامی است."],
        trim: true,
        lowercase: true,
        maxlength: [100, "اسلاگ فارسی نمی‌تواند بیشتر از 100 کاراکتر باشد."],
        minlength: [3, "اسلاگ فارسی نمی‌تواند کمتر از 3 کاراکتر باشد."],
      },
      en: {
        type: String,
        required: [true, "English slug is required."],
        trim: true,
        lowercase: true,
        maxlength: [100, "English slug cannot exceed 100 characters."],
        minlength: [3, "English slug cannot be less than 3 characters."],
      },
    },
    description: {
      type: localizedSchema,
      default: undefined,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    seoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seo",
      default: null,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

categorySchema.index(
  { "slug.fa": 1 },
  { unique: true },
);
categorySchema.index(
  { "slug.en": 1 },
  { unique: true },
);
categorySchema.index({ parentId: 1, isActive: 1 });
categorySchema.index({ isActive: 1, displayOrder: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;
