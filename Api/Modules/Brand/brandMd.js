import mongoose from "mongoose";

const localizedSchema = new mongoose.Schema(
  {
    fa: {
      type: String,
      required: [true, "نام فارسی برند الزامی است."],
      trim: true,
      maxlength: [100, "نام فارسی برند نمی‌تواند بیشتر از 100 کاراکتر باشد."],
      minlength: [3, "نام فارسی برند نمی‌تواند کمتر از 3 کاراکتر باشد."],
    },
    en: {
      type: String,
      required: [true, "English brand name is required."],
      trim: true,
      maxlength: [100, "English brand name cannot exceed 100 characters."],
      minlength: [3, "English brand name cannot be less than 3 characters."],
    },
  },
  { _id: false },
);

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: localizedSchema,
      required: [true, "نام برند الزامی است."],
    },
    slug: {
      fa: {
        type: String,
        required: [true, "اسلاگ فارسی برند الزامی است."],
        trim: true,
        lowercase: true,
        minlength: [3, "اسلاگ فارسی برند نمی‌تواند کمتر از 3 کاراکتر باشد."],
        maxlength: [
          100,
          "اسلاگ فارسی برند نمی‌تواند بیشتر از 100 کاراکتر باشد.",
        ],
      },
      en: {
        type: String,
        required: [true, "English brand slug is required."],
        trim: true,
        lowercase: true,
        minlength: [3, "English brand slug cannot be less than 3 characters."],
        maxlength: [100, "English brand slug cannot exceed 100 characters."],
      },
    },
    description: {
      type: localizedSchema,
      default: undefined,
    },
    logo: {
      type: String,
      default: "",
      trim: true,
    },
    website: {
      type: String,

      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seo",
      default: null,
    },
  },
  { timestamps: true },
);

brandSchema.index({ "slug.fa": 1 }, { unique: true });
brandSchema.index({ "slug.en": 1 }, { unique: true });
brandSchema.index({ isActive: 1, createdAt: -1 });

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
