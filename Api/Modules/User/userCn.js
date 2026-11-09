import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import User from "./userMd.js";
import Product from "../Product/productMd.js";
import bcrypt from "bcryptjs";

// Get All Users
export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query, req.role)
    .filter()
    .search(["fullName", "phoneNumber"])
    .sort()
    .limitFields("-password")
    .paginate();

  const result = await features.execute();
  return res.status(200).json(result);
});

// Get One User
export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "user" ? { _id: req.userId } : { _id: req.params.id };
  const features = new ApiFeatures(User, req.query, req.role)
    .filter()
    .search(["fullname", "phoneNumber"])
    .sort()
    .limitFields("-password")
    .paginate();

  const result = await features.execute();
  return res.status(200).json(result);
});

// Update User
export const update = catchAsync(async (req, res, next) => {
  const { fullName = null, birthDate = null, role = null } = req.body;
  const user = await User.findById(req.params.id);

  if (
    req.role === "user" &&
    req.params.id.toString() !== req.userId.toString()
  ) {
    return next(
      new HandleERROR("you dont have permission to update this user", 400),
    );
  }

  user.fullName = fullName || user.fullName;
  user.birthDate = birthDate || user.birthDate;
  if (req.role === "superAdmin") {
    user.role = role || user.role;
  }

  const newUser = await user.save();

  return res.status(200).json({
    success: true,
    message: "user updated successfully",
    data: newUser,
  });
});

// Change Password
export const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword = null, newPassword = null } = req.body;

  const passReg = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  if (!passReg.test(newPassword)) {
    return next(new HandleERROR("invalid New Password", 400));
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return next(new HandleERROR("user not found", 404));
  }

  if (user.password) {
    if (!oldPassword) {
      return next(new HandleERROR("oldPassword is required", 400));
    }
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    if (!isPasswordValid) {
      return next(new HandleERROR("invalid oldPassword", 400));
    }
  }

  const hashPassword = bcrypt.hashSync(newPassword, 10);
  user.password = hashPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "password changed successfully",
  });
});

// DeActive User
export const deActive = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  const newUser = await user.save();

  return res.status(200).json({
    success: true,
    data: newUser,
    message: newUser.isActive
      ? "user active successfully"
      : "user deActive successfully",
  });
});

// Add Product to Favorites
export const addFavorite = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.productId,
    isPublished: true,
  });
  if (!product) {
    return next(new HandleERROR("Product not found", 404));
  }
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $addToSet: { favoriteProductIds: product._id },
    },
    { new: true },
  );
  if (!user) {
    return next(new HandleERROR("User not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Product added to favorites successfully",
    data: user.favoriteProductIds,
  });
});

// Remove Product from Favorites
export const removeFavorite = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $pull: { favoriteProductIds: req.params.productId },
    },
    { new: true },
  );
  if (!user) {
    return next(new HandleERROR("User not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Product removed from favorites successfully",
    data: user.favoriteProductIds,
  });
});

// Get Favorite Products
export const getFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId).populate({
    path: "favoriteProductIds",
    select: "title slug images ratingAvg ratingCount",
    match: { isPublished: true },
  });
  if (!user) {
    return next(new HandleERROR("User not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: user.favoriteProductIds,
  });
});