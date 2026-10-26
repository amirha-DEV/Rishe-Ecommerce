import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "./productMd.js";
import "../Category/categoryMd.js";
import "../Brand/brandMd.js";
import "../Seo/seoMd.js";
import fs from "fs";
import { __dirname } from "../../app.js";

const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};

export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "admin" || req.role === "superAdmin"
      ? {}
      : { isPublished: true };

  const features = new ApiFeatures(Product, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["title.fa", "title.en", "description.fa", "description.en"])
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "categoryIds", select: "name slug" },
      { path: "brandId", select: "name slug logo" },
      { path: "seoId" },
    ]);

  const result = await features.execute();

  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const condition = {
    _id: req.params.id,
    ...(req.role === "admin" || req.role === "superAdmin"
      ? {}
      : { isPublished: true }),
  };
  const product = await Product.findOne(condition).populate([
    { path: "categoryIds" },
    { path: "brandId" },
    { path: "seoId" },
  ]);
  if (!product) {
    return next(
      new HandleERROR(
        getMessage(req, "محصول پیدا نشد", "Product not found"),
        404,
      ),
    );
  }

  return res.status(200).json({
    success: true,
    data: product,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const {
    ratingCount,
    ratingAvg,
    boughtCount,
    _id,
    createdAt,
    updatedAt,
    __v,
    ...productData
  } = req.body;

  const isPublished = productData.isPublished ?? false;
  delete productData.isPublished;
  if (typeof isPublished !== "boolean") {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "وضعیت انتشار باید مقدار بولی (صحیح یا غلط) باشد",
          "isPublished must be a boolean",
        ),
        400,
      ),
    );
  }
  const product = await Product.create({
    ...productData,
    isPublished,
  });

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "محصول با موفقیت ایجاد شد",
      "Product created successfully",
    ),
    data: product,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new HandleERROR(
        getMessage(req, "محصول پیدا نشد", "Product not found"),
        404,
      ),
    );
  }
  if (
    req.body.images !== undefined &&
    (!Array.isArray(req.body.images) ||
      req.body.images.some((img) => typeof img !== "string"))
  ) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "تصاویر باید آرایه‌ای از رشته‌ها باشند",
          "Images must be an array of strings",
        ),
        400,
      ),
    );
  }
  if (
    req.body.videos !== undefined &&
    (!Array.isArray(req.body.videos) ||
      req.body.videos.some((video) => typeof video !== "string"))
  ) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "ویدیوها باید آرایه‌ای از رشته‌ها باشند",
          "Videos must be an array of strings",
        ),
        400,
      ),
    );
  }
  const {
    ratingCount,
    ratingAvg,
    boughtCount,
    _id,
    createdAt,
    updatedAt,
    __v,
    ...productData
  } = req.body;

  const newProduct = await Product.findByIdAndUpdate(
    req.params.id,
    productData,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!newProduct) {
    return next(
      new HandleERROR(
        getMessage(req, "محصول پیدا نشد", "Product not found"),
        404,
      ),
    );
  }
  if (req.body.images !== undefined) {
    for (let img of product.images) {
      let remove = !req.body.images.find((item) => item == img);

      if (remove) {
        if (fs.existsSync(`${__dirname}/public/${img}`)) {
          fs.unlinkSync(`${__dirname}/public/${img}`);
        }
      }
    }
  }
  if (req.body.videos !== undefined) {
    for (let video of product.videos) {
      let remove = !req.body.videos.find((item) => item == video);

      if (remove) {
        if (fs.existsSync(`${__dirname}/public/${video}`)) {
          fs.unlinkSync(`${__dirname}/public/${video}`);
        }
      }
    }
  }

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "محصول با موفقیت ویرایش شد",
      "Product Updated Successfully",
    ),
    data: newProduct,
  });
});


export const remove = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new HandleERROR(
        getMessage(req, "محصول پیدا نشد", "Product not found"),
        404,
      ),
    );
  }
  if (product.boughtCount > 0) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "این محصول سابقه فروش دارد و امکان حذف آن وجود ندارد",
          "This product has sales history and cannot be deleted",
        ),
        400,
      ),
    );
  }
  for (let img of product.images) {
    if (fs.existsSync(`${__dirname}/public/${img}`)) {
      fs.unlinkSync(`${__dirname}/public/${img}`);
    }
  }
  for (let video of product.videos) {
    if (fs.existsSync(`${__dirname}/public/${video}`)) {
      fs.unlinkSync(`${__dirname}/public/${video}`);
    }
  }
  await Product.findByIdAndDelete(product._id);

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "محصول با موفقیت حذف شد",
      "Product deleted successfully",
    ),
  });
});
