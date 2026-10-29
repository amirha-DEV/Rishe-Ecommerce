
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Brand from "./brandMd.js";
import Product from "../Product/productMd.js";
import { imageHandler } from "../../Utils/imageHandler.js";
import fs from "fs";
import path from "path";
import { __dirname } from "../../app.js";

const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};

const isPrivileged = (req) =>
  req.role === "admin" || req.role === "superAdmin";

const allowedBrandFields = [
  "name",
  "slug",
  "description",
  "logo",
  "website",
  "isActive",
];

const getAllowedFields = (body) =>
  Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedBrandFields.includes(key)),
  );

const getBrandLogoPath = (logo) => path.join(__dirname, "Public", logo);

// Get All Brands
export const getAll = catchAsync(async (req, res) => {
  const condition = isPrivileged(req) ? {} : { isActive: true };

  const features = new ApiFeatures(Brand, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["name.fa", "name.en"])
    .sort()
    .limitFields()
    .paginate();

  const result = await features.execute();

  return res.status(200).json(result);
});

// Get One Brand
export const getOne = catchAsync(async (req, res, next) => {
  const condition = {
    _id: req.params.id,
    ...(isPrivileged(req) ? {} : { isActive: true }),
  };

  const brand = await Brand.findOne(condition);

  if (!brand) {
    return next(
      new HandleERROR(
        getMessage(req, "برند پیدا نشد", "Brand not found"),
        404,
      ),
    );
  }

  return res.status(200).json({
    success: true,
    data: brand,
  });
});

// Create Brand
export const create = catchAsync(async (req, res) => {
  const data = getAllowedFields(req.body);
  const brand = await Brand.create(data);

  return res.status(201).json({
    success: true,
    message: getMessage(req, "برند با موفقیت ساخته شد", "Brand created successfully"),
    data: brand,
  });
});

// Update Brand
export const update = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(
      new HandleERROR(
        getMessage(req, "برند پیدا نشد", "Brand not found"),
        404,
      ),
    );
  }

  const data = getAllowedFields(req.body);

  if (Object.keys(data).length === 0) {
    return next(
      new HandleERROR(
        getMessage(req, "اطلاعات معتبری برای ویرایش ارسال نشده است", "No valid fields provided for update"),
        400,
      ),
    );
  }

  if (
    data.logo !== undefined &&
    brand.logo &&
    data.logo !== brand.logo
  ) {
    imageHandler([brand.logo], data.logo ? [data.logo] : []);
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    req.params.id,
    { $set: data },
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(200).json({
    success: true,
    message: getMessage(req, "برند با موفقیت ویرایش شد", "Brand updated successfully"),
    data: updatedBrand,
  });
});

// Remove Brand
export const remove = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(
      new HandleERROR(
        getMessage(req, "برند پیدا نشد", "Brand not found"),
        404,
      ),
    );
  }

  const product = await Product.findOne({ brandId: brand._id });

  if (product) {
    return next(
      new HandleERROR(
        getMessage(
          req,
          "این برند در یک محصول استفاده شده و قابل حذف نیست",
          "This brand is used by a product and cannot be deleted",
        ),
        400,
      ),
    );
  }

  await Brand.findByIdAndDelete(brand._id);

  if (brand.logo) {
    const logoPath = getBrandLogoPath(brand.logo);

    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }
  }

  return res.status(200).json({
    success: true,
    message: getMessage(req, "برند با موفقیت حذف شد", "Brand deleted successfully"),
  });
});
