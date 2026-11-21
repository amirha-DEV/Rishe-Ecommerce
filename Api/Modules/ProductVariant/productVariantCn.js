import mongoose from "mongoose";
import { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/productMd.js";
import Attribute from "../Attribute/attributeMd.js";
import ProductVariant from "./productVariantMd.js";

// بررسی معتبر بودن شناسه MongoDB
const isValidId = (id) => {
  return (
    id instanceof mongoose.Types.ObjectId ||
    (typeof id === "string" && /^[a-f\d]{24}$/i.test(id))
  );
};
// اعتبارسنجی ویژگی‌های تنوع و مشخصات وابسته
const validateVariantData = async (product, attributes, details, next) => {
  if (!Array.isArray(attributes) || !Array.isArray(details)) {
    return next(
      new HandleERROR(
        "ویژگی‌ها و مشخصات وابسته باید به‌صورت آرایه ارسال شوند.",
        400,
      ),
    );
  }

  const allowedAttributeIds = (product.attributeIds || []).map(String);

  if (new Set(allowedAttributeIds).size !== allowedAttributeIds.length) {
    return next(
      new HandleERROR("ویژگی‌های تعریف‌شده برای محصول تکراری هستند.", 400),
    );
  }

  const allItems = [...attributes, ...details];

  for (const item of allItems) {
    if (!item || typeof item !== "object" || !isValidId(item.attributeId)) {
      return next(new HandleERROR("ساختار یا شناسه ویژگی معتبر نیست.", 400));
    }
  }

  const usedAttributeIds = allItems.map((item) => String(item.attributeId));

  if (new Set(usedAttributeIds).size !== usedAttributeIds.length) {
    return next(
      new HandleERROR(
        "هر ویژگی فقط یک بار می‌تواند در تنوع محصول استفاده شود.",
        400,
      ),
    );
  }

  if (usedAttributeIds.some((id) => !allowedAttributeIds.includes(id))) {
    return next(
      new HandleERROR(
        "یکی از ویژگی‌های انتخاب‌شده متعلق به این محصول نیست.",
        400,
      ),
    );
  }

  // دریافت تمام ویژگی‌های تعریف‌شده برای محصول
  const attributeDocs = await Attribute.find({
    _id: { $in: allowedAttributeIds },
  });

  if (
    attributeDocs.length !== allowedAttributeIds.length ||
    attributeDocs.some((attribute) => !attribute.isActive)
  ) {
    return next(
      new HandleERROR(
        "یکی از ویژگی‌های تعریف‌شده برای محصول معتبر یا فعال نیست.",
        400,
      ),
    );
  }

  const attributeMap = new Map(
    attributeDocs.map((attribute) => [String(attribute._id), attribute]),
  );

  // بررسی ویژگی‌های انتخابی
  for (const item of attributes) {
    if (!isValidId(item.valueId)) {
      return next(new HandleERROR("شناسه مقدار ویژگی معتبر نیست.", 400));
    }

    const attribute = attributeMap.get(String(item.attributeId));

    if (!attribute || attribute.type !== "select" || !attribute.isVariant) {
      return next(
        new HandleERROR("ویژگی انتخاب‌شده برای ساخت تنوع مجاز نیست.", 400),
      );
    }

    const selectedValue = attribute.values.id(item.valueId);

    if (!selectedValue || !selectedValue.isActive) {
      return next(
        new HandleERROR("مقدار انتخاب‌شده برای ویژگی معتبر یا فعال نیست.", 400),
      );
    }
  }

  // بررسی اجباری بودن تمام ویژگی‌های انتخابی محصول
  const requiredVariantAttributeIds = attributeDocs
    .filter((attribute) => attribute.isVariant)
    .map((attribute) => String(attribute._id));

  const submittedVariantAttributeIds = attributes.map((item) =>
    String(item.attributeId),
  );

  const hasAllRequiredAttributes = requiredVariantAttributeIds.every((id) =>
    submittedVariantAttributeIds.includes(id),
  );

  if (!hasAllRequiredAttributes) {
    return next(
      new HandleERROR(
        "تمام ویژگی‌های انتخابی محصول باید در تنوع ثبت شوند.",
        400,
      ),
    );
  }

  // بررسی مشخصات وابسته
  for (const item of details) {
    const attribute = attributeMap.get(String(item.attributeId));

    if (!attribute || attribute.isVariant) {
      return next(new HandleERROR("ویژگی وابسته انتخاب‌شده معتبر نیست.", 400));
    }

    if (attribute.type === "number") {
      if (typeof item.value !== "number" || !Number.isFinite(item.value)) {
        return next(
          new HandleERROR("مقدار ویژگی عددی باید یک عدد معتبر باشد.", 400),
        );
      }
    } else if (attribute.type === "text") {
      if (typeof item.value !== "string" || !item.value.trim()) {
        return next(
          new HandleERROR("مقدار ویژگی متنی باید یک متن معتبر باشد.", 400),
        );
      }
    } else if (attribute.type === "select") {
      if (!isValidId(item.value)) {
        return next(
          new HandleERROR("شناسه مقدار ویژگی انتخابی معتبر نیست.", 400),
        );
      }

      const selectedValue = attribute.values.id(item.value);

      if (!selectedValue || !selectedValue.isActive) {
        return next(
          new HandleERROR(
            "مقدار انتخاب‌شده برای ویژگی وابسته معتبر نیست.",
            400,
          ),
        );
      }
    }
  }

  return true;
};

// ساخت ترکیب استاندارد برای مقایسه تنوع‌ها
const createCombinationKey = (attributes) => {
  return attributes
    .map((item) => ({
      attributeId: String(item.attributeId),
      valueId: String(item.valueId),
    }))
    .sort((a, b) => a.attributeId.localeCompare(b.attributeId))
    .map((item) => `${item.attributeId}:${item.valueId}`)
    .join("|");
};

// بررسی تکراری نبودن ترکیب ویژگی‌ها برای یک محصول
const checkDuplicateCombination = async (
  productId,
  attributes,
  currentVariantId = null,
) => {
  const variants = await ProductVariant.find({
    productId,
    isActive: true,
    ...(currentVariantId && {
      _id: { $ne: currentVariantId },
    }),
  }).select("_id attributes");
  const newKey = createCombinationKey(attributes);
  const duplicate = variants.some(
    (variant) => createCombinationKey(variant.attributes) === newKey,
  );

  return duplicate;
};

export const getAll = catchAsync(async (req, res, next) => {
  const { productId } = req.query;
  if (!isValidId(productId)) {
    return next(new HandleERROR("شناسه محصول معتبر نیست.", 400));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleERROR("محصول موردنظر پیدا نشد.", 404));
  }
  const filter = { productId };
  if (req.role !== "admin" && req.role !== "superAdmin") {
    filter.isActive = true;
  }
  const variants = await ProductVariant.find(filter).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    message: "تنوع‌های محصول با موفقیت دریافت شدند.",
    data: variants,
  });
});

export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return next(new HandleERROR("شناسه تنوع محصول معتبر نیست.", 400));
  }
  const filter = { _id: id };
  if (req.role !== "admin" && req.role !== "superAdmin") {
    filter.isActive = true;
  }
  const variant = await ProductVariant.findOne(filter);
  if (!variant) {
    return next(new HandleERROR("تنوع محصول پیدا نشد.", 404));
  }

  res.status(200).json({
    success: true,
    message: "تنوع محصول با موفقیت دریافت شد.",
    data: variant,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const {productId, attributes = [], details = [], price, stock = 0, isMadeToOrder = false, isActive = true} = req.body;
  if (!isValidId(productId)) {
    return next(new HandleERROR("شناسه محصول معتبر نیست.", 400));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleERROR("محصول پیدا نشد.", 404));
  }
  const validation = await validateVariantData(
    product,
    attributes,
    details,
    next,
  );
  if (validation !== true) return;
  if (isActive) {
    const isDuplicate = await checkDuplicateCombination(
      productId,
      attributes,
    );
    if (isDuplicate) {
      return next(
        new HandleERROR(
          "این ترکیب از ویژگی‌ها قبلاً برای محصول ثبت شده است.",
          409,
        ),
      );
    }
  }

  const variant = await ProductVariant.create({
    productId,
    attributes,
    details,
    price,
    stock,
    isMadeToOrder,
    isActive,
  });

  res.status(201).json({
    success: true,
    message: "تنوع محصول با موفقیت ایجاد شد.",
    data: variant,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return next(new HandleERROR("شناسه تنوع محصول معتبر نیست.", 400));
  }
  const variant = await ProductVariant.findById(id);
  if (!variant) {
    return next(new HandleERROR("تنوع محصول پیدا نشد.", 404));
  }
  const allowedFields = [
    "attributes",
    "details",
    "price",
    "stock",
    "isMadeToOrder",
    "isActive",
  ];
  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }
  if (Object.keys(updates).length === 0) {
  return next(
    new HandleERROR(
      "هیچ فیلد معتبری برای ویرایش ارسال نشده است.",
      400,
    ),
  );
}
  const finalAttributes = Object.hasOwn(updates, "attributes")
  ? updates.attributes
  : variant.attributes;
  const finalDetails = Object.hasOwn(updates, "details")
  ? updates.details
  : variant.details;
  const finalIsActive = Object.hasOwn(updates, "isActive")
  ? updates.isActive
  : variant.isActive;

  const product = await Product.findById(variant.productId);
  if (!product) {
    return next(new HandleERROR("محصول مرتبط با این تنوع پیدا نشد.", 404));
  }
  const validation = await validateVariantData(
    product,
    finalAttributes,
    finalDetails,
    next,
  );
  if (validation !== true) return;
  if (finalIsActive) {
    const isDuplicate = await checkDuplicateCombination(
      variant.productId,
      finalAttributes,
      variant._id,
    );
    if (isDuplicate) {
      return next(
        new HandleERROR(
          "این ترکیب از ویژگی‌ها قبلاً برای محصول ثبت شده است.",
          409,
        ),
      );
    }
  }
  Object.assign(variant, updates);
  await variant.save();

  res.status(200).json({
    success: true,
    message: "تنوع محصول با موفقیت ویرایش شد.",
    data: variant,
  });
});

// حذف یا غیرفعال‌سازی ویژگی محصول
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return next(new HandleERROR("شناسه تنوع محصول معتبر نیست.", 400));
  }
  const variant = await ProductVariant.findById(id);
  if (!variant) {
    return next(new HandleERROR("تنوع محصول پیدا نشد.", 404));
  }
  if (!variant.isActive) {
    return next(
      new HandleERROR("این تنوع محصول قبلاً غیرفعال شده است.", 400),
    );
  }
  variant.isActive = false;
  await variant.save();

  res.status(200).json({
    success: true,
    message: "تنوع محصول با موفقیت غیرفعال شد.",
    data: variant,
  });
});
