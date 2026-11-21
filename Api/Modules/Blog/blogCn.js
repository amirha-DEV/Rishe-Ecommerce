import mongoose from "mongoose";
import { catchAsync, HandleERROR } from "vanta-api";
import Blog from "./blogMd.js";
import BlogCategory from "../BlogCategory/blogCategoryMd.js";

// دریافت پیام متناسب با زبان درخواست
const getMessage = (req, fa, en) => {
  const language = req.headers["accept-language"]?.split(",")[0];

  return language?.startsWith("en") ? en : fa;
};
// بررسی معتبر بودن شناسه MongoDB
const isValidId = (id) => mongoose.isValidObjectId(id);
// بررسی معتبر بودن دسته‌بندی مقاله
const validateCategory = async (categoryId, req) => {
  if (!isValidId(categoryId)) {
    throw new HandleERROR(
      getMessage(req, "شناسه دسته‌بندی معتبر نیست.", "Invalid category ID."),
      422,
    );
  }
  const category = await BlogCategory.findById(categoryId);
  if (!category) {
    throw new HandleERROR(
      getMessage(req, "دسته‌بندی موردنظر پیدا نشد.", "Category not found."),
      404,
    );
  }
  if (!category.isActive) {
    throw new HandleERROR(
      getMessage(
        req,
        "دسته‌بندی انتخاب‌شده غیرفعال است.",
        "Selected category is inactive.",
      ),
      422,
    );
  }

  return category;
};
// بررسی تکراری نبودن اسلاگ مقاله
const validateSlug = async (slug, req, blogId = null) => {
  const filter = {
    $or: [{ "slug.fa": slug.fa }, { "slug.en": slug.en }],
  };
  if (blogId) {
    filter._id = { $ne: blogId };
  }
  const existingBlog = await Blog.findOne(filter);
  if (existingBlog) {
    throw new HandleERROR(
      getMessage(
        req,
        "این اسلاگ قبلاً برای مقاله دیگری ثبت شده است.",
        "This slug is already used by another blog.",
      ),
      409,
    );
  }
};

export const getAll = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, categoryId, isPublished, search } = req.query;
  const filter = {};
  // فیلتر کردن مقالات بر اساس دسته‌بندی
  if (categoryId) {
    if (!isValidId(categoryId)) {
      throw new HandleERROR(
        getMessage(req, "شناسه دسته‌بندی معتبر نیست.", "Invalid category ID."),
        422,
      );
    }
    filter.categoryId = categoryId;
  }
  // فیلتر کردن مقالات بر اساس وضعیت انتشار
  if (isPublished !== undefined) {
    if (!["true", "false"].includes(isPublished)) {
      throw new HandleERROR(
        getMessage(
          req,
          "وضعیت انتشار معتبر نیست.",
          "Invalid publication status.",
        ),
        422,
      );
    }
    filter.isPublished = isPublished === "true";
  }
  // جست‌وجو در عنوان فارسی و انگلیسی مقاله
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { "title.fa": { $regex: escapedSearch, $options: "i" } }, // برای فارسیهم لازمه؟ فکر نکنم!همم
      { "title.en": { $regex: escapedSearch, $options: "i" } },
    ];
  }
  // محاسبه صفحه فعلی، تعداد نتایج و تعداد اسناد قابل رد شدن
  const currentPage = Math.max(Number(page) || 1, 1);
  const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (currentPage - 1) * perPage;

  // دریافت مقالات و تعداد کل نتایج به‌صورت هم‌زمان
  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("categoryId", "name slug")
      .populate("authorId", "fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage),

    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "مقالات با موفقیت دریافت شدند.",
      "Blogs retrieved successfully.",
    ),
    results: blogs.length,
    pagination: {
      total,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(total / perPage),
    },
    data: blogs,
  });
});

export const getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    throw new HandleERROR(
      getMessage(req, "شناسه مقاله معتبر نیست.", "Invalid blog ID."),
      422,
    );
  }
  const blog = await Blog.findById(id)
    .populate("categoryId", "name slug")
    .populate("authorId", "fullName");

  if (!blog) {
    throw new HandleERROR(
      getMessage(req, "مقاله موردنظر پیدا نشد.", "Blog not found."),
      404,
    );
  }

  res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "مقاله با موفقیت دریافت شد.",
      "Blog retrieved successfully.",
    ),
    data: blog,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    details,
    slug,
    image,
    categoryId,
    tags,
    seo,
    isPublished,
  } = req.body;

  // بررسی معتبر بودن دسته‌بندی انتخاب‌شده
  await validateCategory(categoryId, req);

  // بررسی تکراری نبودن اسلاگ مقاله
  await validateSlug(slug, req);

  const blog = await Blog.create({
    title,
    description,
    details,
    slug,
    image,
    categoryId,
    authorId: req.user?._id || null,
    tags,
    seo,
    isPublished: isPublished ?? false,
    publishedAt: isPublished ? new Date() : null,
  });

  res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "مقاله با موفقیت ایجاد شد.",
      "Blog created successfully.",
    ),
    data: blog,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    throw new HandleERROR(
      getMessage(req, "شناسه مقاله معتبر نیست.", "Invalid blog ID."),
      422,
    );
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new HandleERROR(
      getMessage(req, "مقاله موردنظر پیدا نشد.", "Blog not found."),
      404,
    );
  }
  const {
    title,
    description,
    details,
    slug,
    image,
    categoryId,
    tags,
    seo,
    isPublished,
  } = req.body;

  // ویرایش دسته‌بندی مقاله
  if (categoryId !== undefined) {
    await validateCategory(categoryId, req);
    blog.categoryId = categoryId;
  }
  // ویرایش اسلاگ مقاله
  if (slug !== undefined) {
    await validateSlug(slug, req, blog._id);
    blog.slug = slug;
  }
  // ویرایش اطلاعات اصلی مقاله
  if (title !== undefined) blog.title = title;
  if (description !== undefined) {blog.description = description;}
  if (details !== undefined) blog.details = details;
  if (image !== undefined) blog.image = image;
  if (tags !== undefined) blog.tags = tags;
  if (seo !== undefined) blog.seo = seo;

  // مدیریت وضعیت انتشار و زمان انتشار مقاله
  if (isPublished !== undefined) {
    const wasPublished = blog.isPublished;
    blog.isPublished = isPublished;
    if (isPublished && !wasPublished) {
      blog.publishedAt = new Date();
    }
    if (!isPublished) {
      blog.publishedAt = null;
    }
  }

  await blog.save();

  res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "مقاله با موفقیت ویرایش شد.",
      "Blog updated successfully.",
    ),
    data: blog,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    throw new HandleERROR(
      getMessage(req, "شناسه مقاله معتبر نیست.", "Invalid blog ID."),
      422,
    );
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new HandleERROR(
      getMessage(req, "مقاله موردنظر پیدا نشد.", "Blog not found."),
      404,
    );
  }
  await Blog.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "مقاله با موفقیت حذف شد.",
      "Blog deleted successfully.",
    ),
    data: null,
  });
});
