import mongoose from "mongoose";

const variantAttributeSchema = new mongoose.Schema(
  {
    attributeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: [true, "ویژگی تنوع الزامی است."],
    },
    valueId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "مقدار ویژگی الزامی است."],
    },
  },
  { _id: false },
);

const variantDetailSchema = new mongoose.Schema(
  {
    attributeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: [true, "ویژگی وابسته الزامی است."],
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "مقدار ویژگی وابسته الزامی است."],
    },
  },
  { _id: false },
);

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "محصول الزامی است."],
      index: true,
    },
    attributes: {
      type: [variantAttributeSchema],
      default: [],
    },
    details: {
      type: [variantDetailSchema],
      default: [],
    },
    price: {
      type: Number,
      required: [true, "قیمت تنوع محصول الزامی است."],
      min: [0, "قیمت نمی‌تواند منفی باشد."],
      validate: {
        validator: (price) => Number.isFinite(price),
        message: "قیمت باید یک عدد معتبر باشد.",
      },
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "موجودی نمی‌تواند منفی باشد."],
      validate: {
        validator: Number.isInteger,
        message: "موجودی باید عدد صحیح باشد.",
      },
    },
    isMadeToOrder: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

productVariantSchema.index({ productId: 1, isActive: 1 });

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
export default ProductVariant;
