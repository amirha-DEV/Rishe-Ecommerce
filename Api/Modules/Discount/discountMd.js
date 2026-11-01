import mongoose from "mongoose";

const userUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger,
    },
  },
  { _id: false },
);

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      required: [true, "کد اجباری است"],
    },

    type: {
      type: String,
      enum: ["fixed", "percentage"],
      required: [true, "نوع تخفیف اجباری است"],
    },

    value: {
      type: Number,
      required: [true, "مقدار اجباری است"],
      min: [0.01, "مقدار باید بیشتر از صفر باشد"],
      validate: {
        validator: function (value) {
          if (this.type === "percentage") {
            return value > 0 && value < 100;
          }
          return value > 0;
        },
        message: "مقدار درصد باید بین 0 و 100 باشد",
      },
    },

    maxPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    minPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    expireAt: {
      type: Date,
      default: null,
    },

    startAt: {
      type: Date,
      default: null,
    },

    usageLimit: {
      type: Number,
      default: null,
      min: 1,
      validate: Number.isInteger,
    },

    userUsedLimit: {
      type: Number,
      default: 1,
      min: 1,
      validate: Number.isInteger,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger,
    },

    userUsage: {
      type: [userUsageSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

discountSchema.pre("validate", function () {
  if (this.startAt && this.expireAt && this.expireAt <= this.startAt) {
    this.invalidate("expireAt", "تاریخ انقضا باید بعد از تاریخ شروع باشد");
  }

  if (
    this.minPrice !== null &&
    this.maxPrice !== null &&
    this.maxPrice < this.minPrice
  ) {
    this.invalidate(
      "maxPrice",
      "حداکثر مبلغ باید بیشتر یا مساوی حداقل مبلغ باشد",
    );
  }
});

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
