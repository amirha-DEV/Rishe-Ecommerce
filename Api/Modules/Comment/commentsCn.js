import ApiFeatures, { catchAsync } from "vanta-api";
import Comment from "./commentMd.js";
import User from "../User/userMd.js";
import Product from "../Product/productMd.js";

const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};
// Get All Comments

export const getAll = catchAsync(async (req, res, next) => {
  const condition = {};

  if (req.role !== "admin" && req.role !== "superAdmin") {
    condition.isApproved = true;
    condition.parentId = null;
  }

  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .paginate()
    .populate([
      {
        path: "userId",
        select: "fullName phoneNumber role",
      },
      {
        path: "productId",
        select: "title images",
      },
    ]);

  const result = await features.execute();

  return res.status(200).json(result);
});

// GetAllCommentOfProduct
export const getAllCommentOfProduct = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "admin" || req.role === "superAdmin"
      ? { productId: req.params.id, parentId: null }
      : {
          productId: req.params.id,
          parentId: null,
          isApproved: true,
        };

  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .paginate()
    .populate([
      {
        path: "userId",
        select: "fullName phoneNumber role",
      },
      {
        path: "productId",
        select: "title images",
      },
    ]);

  const result = await features.execute();

  return res.status(200).json(result);
});

// ChangePublish Comment
export const changePublish = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new HandleERROR(
        getMessage(req, "Comment not found", "کامنت پیدا نشد"),
        404,
      ),
    );
  }

  comment.isApproved = !comment.isApproved;

  const newComment = await comment.save();

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "Comment approval status changed",
      "وضعیت تأیید کامنت تغییر یافت",
    ),
    data: newComment,
  });
});

// Create Comment
export const create = catchAsync(async (req, res, next) => {
  const { rating, content, productId } = req.body;
  const { userId } = req;

  const user = await User.findById(userId);

  if (!user) {
    return next(new HandleERROR("User not found", 404));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new HandleERROR("Product not found", 404));
  }

  const isBought = !!user.boughtProductIds?.some(
    (item) => item.toString() === productId,
  );

  const isRated = !!user.ratedProductIds?.some(
    (item) => item.toString() === productId,
  );

  if (rating !== undefined && rating !== null) {
    if (
      !Number.isInteger(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return next(new HandleERROR("Rating must be between 1 and 5", 400));
    }

    if (!isBought) {
      return next(new HandleERROR("You must buy this product to rate it", 403));
    }

    if (isRated) {
      return next(new HandleERROR("You have already rated this product", 400));
    }
  }

  const newComment = await Comment.create({
    content,
    productId,
    userId,
    isBought,
    ...(rating !== undefined && rating !== null
      ? { rating: Number(rating) }
      : {}),
  });

  if (rating !== undefined && rating !== null) {
    user.ratedProductIds.push(productId);
    await user.save();
  }

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "Comment created successfully",
      "کامنت با موفقیت ثبت شد",
    ),
    data: newComment,
  });
});

// Delete Comment
export const remove = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(
      new HandleERROR(
        getMessage(req, "Comment not found", "کامنت پیدا نشد"),
        404,
      ),
    );
  }

  if (!comment.parentId) {
    await Comment.deleteMany({ parentId: comment._id });
  }

  return res.status(200).json({
    success: true,
    message: getMessage(req, "Comment deleted", "کامنت حذف شد"),
  });
});

// Replay
export const replay = catchAsync(async (req, res, next) => {
  const { id: replyTo } = req.params;
  const { content } = req.body;
  const { userId } = req;

  const comment = await Comment.findById(replyTo);

  if (!comment) {
    return next(
      new HandleERROR(
        getMessage(req, "Comment not found", "کامنت پیدا نشد"),
        404
      )
    );
  }

  if (comment.parentId) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "You cannot reply to a reply",
          "امکان پاسخ دادن به یک پاسخ وجود ندارد"
        ),
        400
      )
    );
  }

  const newReply = await Comment.create({
    parentId: comment._id,
    productId: comment.productId,
    userId,
    content,
    isApproved: req.role !== "user",
  });

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "Reply created successfully",
      "پاسخ با موفقیت ثبت شد"
    ),
    data: newReply,
  });
});

