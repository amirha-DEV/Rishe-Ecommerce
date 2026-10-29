import mongoose from "mongoose";

const localizedSchema = new mongoose.Schema(
  {
    fa: {
      type: String,
      required: [true, "عنوان فارسی الزامی است"],
      trim: true,
      minlength: [3, "عنوان فارسی باید حداقل ۳ کاراکتر باشد"],
      maxlength: [150, "عنوان فارسی نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد"],
    },
    en: {
      type: String,
      required: [true, "English title is required"],
      trim: true,
      minlength: [3, "English title must be at least 3 characters"],
      maxlength: [150, "English title cannot exceed 150 characters"],
    },
  },
  { _id: false }
);

const optionalLocalizedSchema = new mongoose.Schema(
  {
    fa: {
      type: String,
      trim: true,
      maxlength: [5000, "متن فارسی نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد"],
      minlength: [3, "متن فارسی باید حداقل ۳ کاراکتر باشد"],
    },
    en: {
      type: String,
      trim: true,
      maxlength: [5000, "English text cannot exceed 5000 characters"],
      minlength: [3, "English text must be at least 3 characters"],
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "برند محصول الزامی است"],
      index: true,
    },
    categoryIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      required: [true, "دسته‌بندی محصول الزامی است"],
      validate: {
        validator: function (categories) {
          return (
            Array.isArray(categories) &&
            categories.length > 0 &&
            categories.every((category) => category != null) &&
            new Set(categories.map(String)).size === categories.length
          );
        },
        message: "محصول باید حداقل یک دسته‌بندی یکتا داشته باشد",
      },
    },
    title: {
      type: localizedSchema,
      required: [true, "عنوان محصول الزامی است"],
    },
    description: {
      type: optionalLocalizedSchema,
      default: "",
    },
    details: {
      type: optionalLocalizedSchema,
      default: "",
    },
    slug: {
      fa: {
        type: String,
        required: [true, "اسلاگ فارسی الزامی است"],
        trim: true,
        lowercase: true,
        minlength: [3, "اسلاگ فارسی باید حداقل ۳ کاراکتر باشد"],
        maxlength: [180, "اسلاگ فارسی نمی‌تواند بیشتر از ۱۸۰ کاراکتر باشد"],
      },
      en: {
        type: String,
        required: [true, "English slug is required"],
        trim: true,
        lowercase: true,
        minlength: [3, "English slug must be at least 3 characters"],
        maxlength: [180, "English slug cannot exceed 180 characters"],
      },
    },
    images: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
      validate: {
        validator: function (images) {
          return images.every((image) => image.length > 0);
        },
        message: "آدرس تصاویر نمی‌تواند خالی باشد",
      },
    },
    videos: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
      validate: {
        validator: function (videos) {
          return videos.every((video) => video.length > 0);
        },
        message: "آدرس ویدیوها نمی‌تواند خالی باشد",
      },
    },
    information: {
      type: [
        {
          key: {
            type: optionalLocalizedSchema,
            required: [true, "عنوان مشخصات محصول الزامی است"],
          },
          value: {
            type: optionalLocalizedSchema,
            required: [true, "مقدار مشخصات محصول الزامی است"],
          },
        },
      ],
      default: [],
    },
    tags: {
      fa: {
        type: [
          {
            type: String,
            trim: true,
          },
        ],
        default: [],
      },
      en: {
        type: [
          {
            type: String,
            trim: true,
          },
        ],
        default: [],
      },
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد امتیازها نمی‌تواند منفی باشد"],
      validate: {
        validator: Number.isInteger,
        message: "تعداد امتیازها باید عدد صحیح باشد",
      },
    },
    ratingAvg: {
      type: Number,
      default: 0,
      min: [0, "میانگین امتیاز نمی‌تواند کمتر از صفر باشد"],
      max: [5, "میانگین امتیاز نمی‌تواند بیشتر از ۵ باشد"],
    },
    boughtCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد فروش نمی‌تواند منفی باشد"],
      validate: {
        validator: Number.isInteger,
        message: "تعداد فروش باید عدد صحیح باشد",
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    seoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seo",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ "slug.fa": 1 }, { unique: true });
productSchema.index({ "slug.en": 1 }, { unique: true });
productSchema.index({ isPublished: 1, createdAt: -1 });
productSchema.index({ brandId: 1, isPublished: 1 });
productSchema.index({ categoryIds: 1, isPublished: 1 });
productSchema.index({ ratingAvg: -1, ratingCount: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
