import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Category from "./categoryMd.js";
import { imageHandler } from "../../Utils/imageHandler.js";
import Product from "../Product/productMd.js";
import fs from "fs";
import { __dirname } from "../../app.js";

const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};

// Get All categories
export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "admin" || req.role === "superAdmin" ? {} : { isActive: true };

  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["name.fa", "name.en", "description.fa", "description.en"])
    .sort()
    .paginate()
    .limitFields();

  const result = await features.execute();
  return res.status(200).json(result);
});

// Get One Categories
export const getOne = catchAsync(async (req, res, next) => {
  const condition = {
    _id: req.params.id,
    ...(req.role === "admin" || req.role === "superAdmin"
      ? {}
      : { isActive: true }),
  };

  const category = await Category.findOne(condition);

  if (!category) {
    return next(
      new HandleERROR(
        getMessage(req, "دسته‌بندی پیدا نشد", "Category not found"),
        404,
      ),
    );
  }

  return res.status(200).json({
    success: true,
    data: category,
  });
});

// Create Category
export const create = catchAsync(async (req, res) => {
  const { name, slug, description, parentId, image, displayOrder, isActive } =
    req.body;

  const category = await Category.create({
    name,
    slug,
    description,
    parentId,
    image,
    displayOrder,
    isActive,
  });

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "دسته‌بندی با موفقیت ایجاد شد",
      "Category created successfully",
    ),
    data: category,
  });
});

// Update Category
export const update = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new HandleERROR(
        getMessage(req, "دسته‌بندی پیدا نشد", "Category not found"),
        404,
      ),
    );
  }

  if (category.image && req.body.image) {
    imageHandler([category.image], [req.body.image]);
  }

  const { name, slug, description, parentId, image, displayOrder, isActive } =
    req.body;

  const updateCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      slug,
      description,
      parentId,
      image,
      displayOrder,
      isActive,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "دسته‌بندی با موفقیت به‌روزرسانی شد",
      "Category updated successfully",
    ),
    data: updateCategory,
  });
});

// Delete Category
export const remove = catchAsync(async (req, res, next) => {
  const pr = await Product.findOne({ categoryIds: req.params.id });

  if (pr) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "این دسته‌بندی توسط یک محصول استفاده شده است",
          "This category is used by a product",
        ),
        409,
      ),
    );
  }

  const childCategory = await Category.findOne({
    parentId: req.params.id,
  });

  if (childCategory) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "ابتدا زیر‌دسته‌های این دسته‌بندی را حذف یا منتقل کنید",
          "Delete or reassign child categories first",
        ),
        409,
      ),
    );
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(
      new HandleERROR(
        getMessage(req, "دسته‌بندی یافت نشد", "Category not found"),
        404,
      ),
    );
  }

  if (
    category.image &&
    fs.existsSync(`${__dirname}/Public/${category.image}`)
  ) {
    fs.unlinkSync(`${__dirname}/Public/${category.image}`);
  }

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "دسته‌بندی با موفقیت حذف شد",
      "Category deleted successfully",
    ),
  });
});
