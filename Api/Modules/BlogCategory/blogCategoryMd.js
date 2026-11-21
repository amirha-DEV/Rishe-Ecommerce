import mongoose from "mongoose";

const localizedSchema = new mongoose.Schema(
  {
    fa: {
      type: String,
      required: [true, "نام فارسی الزامی است."],
      trim: true,
      minlength: [3, "نام فارسی باید حداقل ۳ کاراکتر باشد."],
      maxlength: [150, "نام فارسی نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد."],
    },
    en: {
      type: String,
      required: [true, "English name is required."],
      trim: true,
      minlength: [3, "English name must be at least 3 characters."],
      maxlength: [150, "English name cannot exceed 150 characters."],
    },
  },
  { _id: false }
);

const optionalLocalizedSchema = new mongoose.Schema(
  {
    fa: {
      type: String,
      trim: true,
      minlength: [3, "توضیحات فارسی باید حداقل ۳ کاراکتر باشد."],
      maxlength: [5000, "توضیحات فارسی نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد."],
    },
    en: {
      type: String,
      trim: true,
      minlength: [3, "English description must be at least 3 characters."],
      maxlength: [5000, "English description cannot exceed 5000 characters."],
    },
  },
  { _id: false }
);

const blogCategorySchema = new mongoose.Schema(
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
        minlength: [3, "اسلاگ فارسی باید حداقل ۳ کاراکتر باشد."],
        maxlength: [180, "اسلاگ فارسی نمی‌تواند بیشتر از ۱۸۰ کاراکتر باشد."],
      },
      en: {
        type: String,
        required: [true, "English slug is required."],
        trim: true,
        lowercase: true,
        minlength: [3, "English slug must be at least 3 characters."],
        maxlength: [180, "English slug cannot exceed 180 characters."],
      },
    },
    description: {
      type: optionalLocalizedSchema,
      default: () => ({}),
    },
    image: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "آدرس تصویر نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد."],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      default: null,
      index: true,
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
  {
    timestamps: true,
  }
);

blogCategorySchema.index(
  { "slug.fa": 1 },
  { unique: true }
);
blogCategorySchema.index(
  { "slug.en": 1 },
  { unique: true }
);
blogCategorySchema.index({
  isActive: 1,
  displayOrder: 1,
});

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
export default BlogCategory;
