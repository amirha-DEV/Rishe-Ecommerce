import mongoose from "mongoose";

const localizedSchema = new mongoose.Schema(
  {
    fa: {
      type: String,
      trim: true,
      required: [true, "مقدار فارسی الزامی است."],
    },
    en: {
      type: String,
      trim: true,
      required: [true, "مقدار انگلیسی الزامی است."],
    },
  },
  { _id: false }
);

const optionalLocalizedSchema = new mongoose.Schema(
  {
    fa: {
      type: String,
      trim: true,
      default: "",
    },
    en: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, "عنوان سئو نمی‌تواند بیشتر از 70 کاراکتر باشد."],
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [170, "توضیحات سئو نمی‌تواند بیشتر از 170 کاراکتر باشد."],
      default: "",
    },
    focusKeyword: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: localizedSchema,
      required: [true, "عنوان مقاله الزامی است."],
    },
    description: {
      type: optionalLocalizedSchema,
      default: () => ({}),
    },
    details: {
      type: localizedSchema,
      required: [true, "محتوای مقاله الزامی است."],
    },
    slug: {
      type: localizedSchema,
      required: [true, "اسلاگ مقاله الزامی است."],
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: [true, "دسته‌بندی مقاله الزامی است."],
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    seo: {
      fa: {
        type: seoSchema,
        default: () => ({}),
      },
      en: {
        type: seoSchema,
        default: () => ({}),
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ "slug.fa": 1 }, { unique: true });
blogSchema.index({ "slug.en": 1 }, { unique: true });
blogSchema.index({ categoryId: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
