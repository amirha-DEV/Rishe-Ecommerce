import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import BlogComment from "./blogCommentMd.js";
import User from "../User/userMd.js";
import Blog from "../Blog/blogMd.js";

// انتخاب پیام مناسب بر اساس زبان درخواست
const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};

export const getAll = catchAsync(async (req, res, next) => {
  const condition = {};
  if (req.role !== "admin" && req.role !== "superAdmin") {
    condition.isApproved = true;
    condition.parentId = null;
  }
  const features = new ApiFeatures(BlogComment, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .paginate()
    .populate([
      { path: "userId", select: "fullName role" },
      { path: "blogId", select: "title slug" },
    ]);
  const result = await features.execute();

  return res.status(200).json(result);
});

export const getAllCommentOfBlog = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "admin" || req.role === "superAdmin"
      ? { blogId: req.params.id, parentId: null }
      : {
          blogId: req.params.id,
          parentId: null,
          isApproved: true,
        };

  const features = new ApiFeatures(BlogComment, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .sort()
    .paginate()
    .populate([
      { path: "userId", select: "fullName role" },
      { path: "blogId", select: "title slug" },
    ]);
  const result = await features.execute();

  return res.status(200).json(result);
});

export const changePublish = catchAsync(async (req, res, next) => {
  const comment = await BlogComment.findById(req.params.id);
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

export const create = catchAsync(async (req, res, next) => {
  const { content, blogId } = req.body;
  const { userId } = req;
  const user = await User.findById(userId);
  if (!user) {
    return next(
      new HandleERROR(getMessage(req, "User not found", "کاربر پیدا نشد"), 404),
    );
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(
      new HandleERROR(getMessage(req, "Blog not found", "مقاله پیدا نشد"), 404),
    );
  }
  if (!blog.isPublished) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "Comments are not allowed for unpublished blogs",
          "امکان ثبت کامنت برای مقالات منتشرنشده وجود ندارد",
        ),
        403,
      ),
    );
  }
  const newComment = await BlogComment.create({
    content,
    blogId,
    userId,
  });

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

export const remove = catchAsync(async (req, res, next) => {
  const comment = await BlogComment.findByIdAndDelete(req.params.id);
  if (!comment) {
    return next(
      new HandleERROR(
        getMessage(req, "Comment not found", "کامنت پیدا نشد"),
        404,
      ),
    );
  }

  // در صورت حذف کامنت اصلی، پاسخ‌های مربوط به آن نیز حذف می‌شوند
  if (!comment.parentId) {
    await BlogComment.deleteMany({ parentId: comment._id });
  }

  return res.status(200).json({
    success: true,
    message: getMessage(req, "Comment deleted", "کامنت حذف شد"),
  });
});

export const replay = catchAsync(async (req, res, next) => {
  const { id: replyTo } = req.params;
  const { content } = req.body;
  const { userId } = req;
  const comment = await BlogComment.findById(replyTo);
  if (!comment) {
    return next(
      new HandleERROR(
        getMessage(req, "Comment not found", "کامنت پیدا نشد"),
        404,
      ),
    );
  }
  // جلوگیری از پاسخ دادن به پاسخ‌های دیگر
  if (comment.parentId) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "You cannot reply to a reply",
          "امکان پاسخ دادن به این پاسخ وجود ندارد",
        ),
        400,
      ),
    );
  }
  const newReply = await BlogComment.create({
    parentId: comment._id,
    blogId: comment.blogId,
    userId,
    content,
    isApproved: req.role !== "user",
  });

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "Reply created successfully",
      "پاسخ با موفقیت ثبت شد",
    ),
    data: newReply,
  });
});
