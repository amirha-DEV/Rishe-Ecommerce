import mongoose from "mongoose";
import { catchAsync, HandleERROR } from "vanta-api";
import BlogCategory from "./blogCategoryMd.js";
import Blog from "../Blog/blogMd.js";

// دریافت پیام متناسب با زبان درخواست
const getMessage = (req, fa, en) => {
  const lang = req.headers["accept-language"]?.split(",")[0]?.split("-")[0];
  return lang === "en" ? en : fa;
};

// بررسی معتبر بودن شناسه MongoDB
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// بررسی معتبر بودن دسته والد و جلوگیری از ایجاد چرخه
const validateParentCategory = async (parentId, categoryId = null, req) => {
  // دسته‌های ریشه نیازی به والد ندارند
  if (!parentId) return;
  if (!isValidId(parentId)) {
    throw new HandleERROR(
      getMessage(req, "شناسه دسته والد معتبر نیست.", "Parent category ID is invalid."),
      400
    );
  }
  // دریافت دسته والد
  const parent = await BlogCategory.findById(parentId);
  if (!parent) {
    throw new HandleERROR(
      getMessage(req, "دسته والد پیدا نشد.", "Parent category not found."),
      404
    );
  }
  if (!parent.isActive) {
    throw new HandleERROR(
      getMessage(req, "دسته والد غیرفعال است.", "Parent category is inactive."),
      400
    );
  }
  // جلوگیری از انتخاب خود دسته به‌عنوان والد
  if (categoryId && parent._id.equals(categoryId)) {
    throw new HandleERROR(
      getMessage(req, "یک دسته نمی‌تواند والد خودش باشد.", "A category cannot be its own parent."),
      400
    );
  }
  // بررسی زنجیره والدها برای جلوگیری از ایجاد چرخه
  const visited = new Set();
  let current = parent;
  while (current) {
    const currentId = current._id.toString();
    if (visited.has(currentId)) {
      throw new HandleERROR(
        getMessage(req, "ساختار والدهای دسته‌بندی دارای چرخه است.", "A cycle exists in the category hierarchy."),
        400
      );
    }
    visited.add(currentId);
    if (categoryId && current._id.equals(categoryId)) {
      throw new HandleERROR(
        getMessage(req, "این تغییر باعث ایجاد چرخه در دسته‌بندی‌ها می‌شود.", "This change would create a category cycle."),
        400
      );
    }
    if (!current.parentId) break;
    current = await BlogCategory.findById(current.parentId);
    if (!current) {
      throw new HandleERROR(
        getMessage(req, "یکی از دسته‌های والد در ساختار پیدا نشد.", "A parent category in the hierarchy was not found."),
        400
      );
    }
  }
};

// بررسی تکراری نبودن اسلاگ‌ها
const validateSlug = async (slug, categoryId = null, req) => {
  const conditions = [
    { "slug.fa": slug.fa },
    { "slug.en": slug.en },
  ];
  const query = {
    $or: conditions,
  };
  if (categoryId) {
    query._id = { $ne: categoryId };
  }
  const existingCategory = await BlogCategory.findOne(query);
  if (existingCategory) {
    throw new HandleERROR(
      getMessage(req, "این اسلاگ قبلاً برای دسته دیگری ثبت شده است.", "One or more of these slugs are already in use."),
      409
    );
  }
};

export const getAll = catchAsync(async (req, res, next) => {
  const filter = {};
  // فیلتر وضعیت فعال بودن
  if (req.query.isActive !== undefined) {
    if (!["true", "false"].includes(req.query.isActive)) {
      throw new HandleERROR(
        getMessage(req, "مقدار وضعیت فعال بودن معتبر نیست.", "Invalid active status value."),
        400
      );
    }
    filter.isActive = req.query.isActive === "true";
  }
  // فیلتر دسته‌های ریشه یا زیرمجموعه‌ها
  if (req.query.parentId !== undefined) {
    if (req.query.parentId === "null") {
      filter.parentId = null;
    } else {
      if (!isValidId(req.query.parentId)) {
        throw new HandleERROR(
          getMessage(req, "شناسه دسته والد معتبر نیست.", "Parent category ID is invalid."),
          400
        );
      }
      filter.parentId = req.query.parentId;
    }
  }
  const categories = await BlogCategory.find(filter).sort({
    displayOrder: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    message: getMessage(req, "دسته‌بندی‌ها با موفقیت دریافت شدند.", "Categories retrieved successfully."),
    results: categories.length,
    data: categories,
  });
});

export const getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    throw new HandleERROR(
      getMessage(req, "شناسه دسته‌بندی معتبر نیست.", "Category ID is invalid."),
      400
    );
  }
  const category = await BlogCategory.findById(id);
  if (!category) {
    throw new HandleERROR(
      getMessage(req, "دسته‌بندی موردنظر پیدا نشد.", "Category not found."),
      404
    );
  }

  res.status(200).json({
    success: true,
    message: getMessage(req, "دسته‌بندی با موفقیت دریافت شد.", "Category retrieved successfully."),
    data: category,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const {
    name,
    slug,
    description,
    image,
    parentId,
    displayOrder,
  } = req.body;

  // بررسی دسته والد
  await validateParentCategory(parentId, null, req);
  // بررسی تکراری نبودن اسلاگ
  await validateSlug(slug, null, req);
  const category = await BlogCategory.create({
    name,
    slug,
    description,
    image,
    parentId: parentId || null,
    displayOrder,
  });

  res.status(201).json({
    success: true,
    message: getMessage(req, "دسته‌بندی با موفقیت ایجاد شد.", "Category created successfully."),
    data: category,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    throw new HandleERROR(
      getMessage(req, "شناسه دسته‌بندی معتبر نیست.", "Category ID is invalid."),
      400
    );
  }
  const category = await BlogCategory.findById(id);
  if (!category) {
    throw new HandleERROR(
      getMessage(req, "دسته‌بندی موردنظر پیدا نشد.", "Category not found."),
      404
    );
  }
  const {
    name,
    slug,
    description,
    image,
    parentId,
    isActive,
    displayOrder,
  } = req.body;
  // بررسی والد فقط در صورت ارسال parentId
  if (Object.hasOwn(req.body, "parentId")) {
    await validateParentCategory(parentId, category._id, req);
    category.parentId = parentId || null;
  }
  // بررسی اسلاگ فقط در صورت ارسال آن
  if (slug) {
    await validateSlug(slug, category._id, req);
    category.slug = slug;
  }
  if (name !== undefined) category.name = name;
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (isActive !== undefined) category.isActive = isActive;
  if (displayOrder !== undefined) category.displayOrder = displayOrder;

  await category.save();

  res.status(200).json({
    success: true,
    message: getMessage(req, "دسته‌بندی با موفقیت ویرایش شد.", "Category updated successfully."),
    data: category,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    throw new HandleERROR(
      getMessage(req, "شناسه دسته‌بندی معتبر نیست.", "Category ID is invalid."),
      400
    );
  }
  const category = await BlogCategory.findById(id);
  if (!category) {
    throw new HandleERROR(
      getMessage(req, "دسته‌بندی موردنظر پیدا نشد.", "Category not found."),
      404
    );
  }
  // بررسی وجود زیرمجموعه
  const hasChildren = await BlogCategory.exists({
    parentId: category._id,
  });
  if (hasChildren) {
    throw new HandleERROR(
      getMessage(req, "ابتدا باید زیرمجموعه‌های این دسته‌بندی تعیین تکلیف شوند.", "Resolve this category's child categories before deleting it."),
      409
    );
  }
  // بررسی وجود مقاله وابسته
  const hasBlogs = await Blog.exists({
    categoryId: category._id,
  });
  if (hasBlogs) {
    throw new HandleERROR(
      getMessage(req, "این دسته‌بندی به مقاله‌هایی متصل است و قابل حذف نیست.", "This category is assigned to one or more blog posts and cannot be deleted."),
      409
    );
  }

  await BlogCategory.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: getMessage(req, "دسته‌بندی با موفقیت حذف شد.", "Category deleted successfully."),
    data: null,
  });
});
