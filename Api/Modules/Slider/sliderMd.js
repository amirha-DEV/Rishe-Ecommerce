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

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: localizedSchema,
      required: [true, "عنوان اسلایدر الزامی است"],
    },

    image: {
      type: String,
      required: [true, "تصویر اسلایدر الزامی است"],
      trim: true,
    },

    href: {
      type: String,
      default: "/",
      trim: true,
    },

    path: {
      type: String,
      required: [true, "مسیر اسلایدر الزامی است"],
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

sliderSchema.index({ isPublished: 1 });
sliderSchema.index({ createdAt: 1 });
sliderSchema.index({ path: 1 });

const Slider = mongoose.model("Slider", sliderSchema);

export default Slider;
