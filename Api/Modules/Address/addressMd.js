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
      required: [true, "عنوان انگلیسی الزامی است"],
      trim: true,
      minlength: [3, "عنوان انگلیسی باید حداقل ۳ کاراکتر باشد"],
      maxlength: [150, "عنوان انگلیسی نمی‌تواند بیشتر از ۱۵۰ کاراکتر باشد"],
    },
  },
  { _id: false },
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
      maxlength: [5000, "متن انگلیسی نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد"],
      minlength: [3, "متن انگلیسی باید حداقل ۳ کاراکتر باشد"],
    },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    title: {
      type: localizedSchema,
      required: [true, "عنوان آدرس الزامی است"],
    },

    description: {
      type: optionalLocalizedSchema,
      default: undefined,
    },

    city: {
      type: String,
      trim: true,
      required: [true, "شهر الزامی است"],
      minlength: [2, "نام شهر باید حداقل ۲ کاراکتر باشد"],
      maxlength: [100, "نام شهر نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
    },

    province: {
      type: String,
      trim: true,
      required: [true, "استان الزامی است"],
      minlength: [2, "نام استان باید حداقل ۲ کاراکتر باشد"],
      maxlength: [100, "نام استان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
    },

    postalCode: {
      type: String,
      trim: true,
      match: [/^(?!([0-9])\1{9})[0-9]{10}$/, "کد پستی باید ۱۰ رقم معتبر باشد"],
      required: [true, "کد پستی الزامی است"],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "شناسه کاربر الزامی است"],
    },

    receiverFullName: {
      type: String,
      trim: true,
      required: [true, "نام و نام خانوادگی گیرنده الزامی است"],
      minlength: [3, "نام گیرنده باید حداقل ۳ کاراکتر باشد"],
      maxlength: [100, "نام گیرنده نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
    },

    receiverPhoneNumber: {
      type: String,
      trim: true,
      match: [/^09\d{9}$/, "شماره موبایل گیرنده معتبر نیست"],
      required: [true, "شماره موبایل گیرنده الزامی است"],
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    lat: {
      type: Number,
      required: [true, "عرض جغرافیایی الزامی است"],
      min: [-90, "عرض جغرافیایی نمی‌تواند کمتر از ۹۰- باشد"],
      max: [90, "عرض جغرافیایی نمی‌تواند بیشتر از ۹۰ باشد"],
    },

    lng: {
      type: Number,
      required: [true, "طول جغرافیایی الزامی است"],
      min: [-180, "طول جغرافیایی نمی‌تواند کمتر از ۱۸۰- باشد"],
      max: [180, "طول جغرافیایی نمی‌تواند بیشتر از ۱۸۰ باشد"],
    },
  },
  { timestamps: true },
);

addressSchema.index({ userId: 1 });

const Address = mongoose.model("Address", addressSchema);

export default Address;
