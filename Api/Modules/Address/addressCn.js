import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Address from "./addressMd.js";
const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};

// Get All Address
export const getAll = catchAsync(async (req, res, next) => {
  const isAdminUser = ["admin", "superAdmin"].includes(req.role);

  const condition = isAdminUser ? {} : { userId: req.userId };

  const features = new ApiFeatures(Address, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["title.fa", "title.en"])
    .sort()
    .paginate();

  if (isAdminUser) {
    features.populate([{ path: "userId", select: "phoneNumber fullName" }]);
  }

  const result = await features.execute();

  return res.status(200).json(result);
});

// Get One address
export const getOne = catchAsync(async (req, res, next) => {
  const isAdminUser = ["admin", "superAdmin"].includes(req.role);

  const condition = isAdminUser
    ? { _id: req.params.id }
    : { userId: req.userId, _id: req.params.id };

  const address = await Address.findOne(condition).populate({
    path: "userId",
    select: "phoneNumber fullName",
  });

  if (!address) {
    return next(new HandleERROR("آدرس موردنظر پیدا نشد", 404));
  }

  return res.status(200).json({
    success: true,
    data: address,
  });
});

// Create Address
export const create = catchAsync(async (req, res, next) => {
  const address = await Address.create({ ...req.body, userId: req.userId });

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "address created successfully",
      "آدرس با موفقیت ساخته شد",
    ),
    data: address,
  });
});

// Update Address
export const update = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new HandleERROR(
        getMessage(req, "Address not found", "آدرس پیدا نشد"),
        404,
      ),
    );
  }

  const isAdminUser = ["admin", "superAdmin"].includes(req.role);

  if (!isAdminUser && address.userId.toString() !== req.userId.toString()) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "You do not have permission to update this address",
          "شما دسترسی لازم برای بروزرسانی این آدرس را ندارید",
        ),
        403,
      ),
    );
  }

  const { userId, ...otherData } = req.body;

  if (otherData.isDefault === true) {
    await Address.updateMany(
      { userId: address.userId, isDefault: true },
      { $set: { isDefault: false } },
    );
  }

  const newAddress = await Address.findByIdAndUpdate(req.params.id, otherData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "Address updated successfully",
      "آدرس با موفقیت بروزرسانی شد",
    ),
    data: newAddress,
  });
});

// Delete Adsress
export const remove = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(
      new HandleERROR(
        getMessage(req, "Address not found", "آدرس پیدا نشد"),
        404,
      ),
    );
  }

  const isAdminUser = ["admin", "superAdmin"].includes(req.role);

  if (!isAdminUser && address.userId.toString() !== req.userId.toString()) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "You do not have permission to delete this address",
          "شما دسترسی لازم برای حذف این آدرس را ندارید",
        ),
        403,
      ),
    );
  }

  await address.deleteOne();

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "Address deleted successfully",
      "آدرس با موفقیت حذف شد",
    ),
  });
});
