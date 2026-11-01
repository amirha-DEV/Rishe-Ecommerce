import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Discount from "./discountMd.js";
import Cart from "../Cart/cartMd.js";

const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};

// Validate Code
export const validateCode = (userId, cart, discount) => {
  const errors = [];

  if (!discount.isActive) {
    errors.push("Discount code is deactivated");
  }

  if (
    discount.minPrice !== null &&
    discount.minPrice !== undefined &&
    discount.minPrice > cart.finalPrice
  ) {
    errors.push(
      `Minimum price is ${discount.minPrice} and cart final price is ${cart.finalPrice}`,
    );
  }

  if (
    discount.maxPrice !== null &&
    discount.maxPrice !== undefined &&
    discount.maxPrice < cart.finalPrice
  ) {
    errors.push(
      `Maximum price is ${discount.maxPrice} and cart final price is ${cart.finalPrice}`,
    );
  }

  const now = Date.now();

  if (discount.expireAt && discount.expireAt.getTime() < now) {
    errors.push("Discount code is expired");
  }

  if (discount.startAt && discount.startAt.getTime() > now) {
    errors.push("Discount code has not started yet");
  }

  if (
    discount.usageLimit !== null &&
    discount.usageLimit !== undefined &&
    discount.usedCount >= discount.usageLimit
  ) {
    errors.push("Discount code usage limit reached");
  }

  const userUsage = discount.userUsage.find(
    (item) => item.userId.toString() === userId.toString(),
  );

  const findUser = userUsage?.usedCount ?? 0;

  if (
    discount.userUsedLimit !== null &&
    discount.userUsedLimit !== undefined &&
    findUser >= discount.userUsedLimit
  ) {
    errors.push("You have reached the usage limit for this discount code");
  }

  if (errors.length > 0) {
    return {
      success: false,
      message: errors.join(" | "),
    };
  }

  return {
    success: true,
    message: "Discount code is valid",
  };
};

// Get All Discount
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Discount, req.query, req.role)
    .filter()
    .search(["code"])
    .sort()
    .paginate();

  const result = await features.execute();
  return res.status(200).json(result);
});

// Get One Discount
export const getOne = catchAsync(async (req, res, next) => {
  const discount = await Discount.findById(req.params.id);

  if (!discount) {
    return next(new HandleERROR("Discount not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: discount,
  });
});

// Delete Discount
export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const discount = await Discount.findById(id);

  if (!discount) {
    return next(
      new HandleERROR(
        getMessage(req, "Discount not found", "کد تخفیف پیدا نشد"),
        404,
      ),
    );
  }

  if (discount.usedCount > 0) {
    return next(
      new HandleERROR(
        getMessage(req, "Discount is already used", "کد تخفیف استفاده شده است"),
        400,
      ),
    );
  }

  await discount.deleteOne();

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "Discount deleted successfully",
      "کد تخفیف با موفقیت حذف شد",
    ),
    data: null,
  });
});

// Create Discount
export const create = catchAsync(async (req, res, next) => {
  const discount = await Discount.create(req.body);

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "Discount created successfully",
      "کد تخفیف با موفقیت ایجاد شد",
    ),
    data: discount,
  });
});

// Update Discount
export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const discount = await Discount.findById(id);
  const { type = null, value = null } = req.body;

  if (!discount) {
    return next(
      new HandleERROR(
        getMessage(req, "discount not found", "کد تخفیف پیدا نشد "),
        404,
      ),
    );
  }

  if (type && type != discount.type && discount.usedCount > 0) {
    return next(
      new HandleERROR(
        getMessage(req, "discount is used", "کد تخفیف قبلا استافده شده "),
        404,
      ),
    );
  }

  if (value && value != discount.value && discount.usedCount > 0) {
    return next(
      new HandleERROR(
        getMessage(req, "discount is used", "کد تخفیف قبلا استافده شده "),
        404,
      ),
    );
  }

  const updateDiscount = await Discount.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: updateDiscount,
    message: getMessage(
      req,
      "discount updated successfully",
      "کد تخفیف با موفقیت بروزرسانی شد",
    ),
  });
});

// Check Code
export const checkCode = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const { code } = req.body;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(
      new HandleERROR(
        getMessage(req, "Cart not found", "سبد خرید پیدا نشد"),
        404,
      ),
    );
  }

  const discount = await Discount.findOne({
    code: code.trim().toUpperCase(),
  });

  if (!discount) {
    return next(
      new HandleERROR(
        getMessage(req, "Discount not found", "کد تخفیف پیدا نشد"),
        404,
      ),
    );
  }

  const resultValidate = validateCode(userId, cart, discount);

  if (!resultValidate.success) {
    return res.status(400).json({
      success: false,
      message: resultValidate.message,
    });
  }

  const finalPriceAfterDiscount =
    discount.type === "fixed"
      ? Math.max(0, cart.finalPrice - discount.value)
      : cart.finalPrice * (1 - discount.value / 100);

  return res.status(200).json({
    success: true,
    data: {
      finalPriceAfterDiscount,
    },
    message: getMessage(req, "Discount is valid", "کد تخفیف معتبر است"),
  });
});
