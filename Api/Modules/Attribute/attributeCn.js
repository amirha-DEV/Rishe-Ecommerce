import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Attribute from "./attributeMd.js";

const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};

export const getAll = catchAsync(async (req, res) => {
  const condition =
    req.role === "admin" || req.role === "superAdmin" ? {} : { isActive: true };
  const features = new ApiFeatures(Attribute, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["name.fa", "name.en", "slug.fa", "slug.en"])
    .sort()
    .paginate()
    .limitFields();
  const result = await features.execute();

  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const condition = {
    _id: req.params.id,
    ...(req.role === "admin" || req.role === "superAdmin"
      ? {}
      : { isActive: true }),
  };
  const attribute = await Attribute.findOne(condition);
  if (!attribute) {
    return next(
      new HandleERROR(
        getMessage(req, "ویژگی پیدا نشد", "Attribute not found"),
        404,
      ),
    );
  }

  return res.status(200).json({
    success: true,
    data: attribute,
  });
});

export const create = catchAsync(async (req, res) => {
  const { name, slug, type, isVariant, unit, values, isActive, displayOrder } = req.body;
  const attribute = await Attribute.create({
    name,
    slug,
    type,
    isVariant,
    unit,
    values,
    isActive,
    displayOrder,
  });

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "ویژگی با موفقیت ایجاد شد",
      "Attribute created successfully",
    ),
    data: attribute,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const attribute = await Attribute.findById(req.params.id);
  if (!attribute) {
    return next(
      new HandleERROR(
        getMessage(req, "ویژگی پیدا نشد", "Attribute not found"),
        404,
      ),
    );
  }
  const allowedFields = [
    "name",
    "slug",
    "type",
    "isVariant",
    "unit",
    "values",
    "isActive",
    "displayOrder",
  ];
  for (const field of allowedFields) {
    if (Object.hasOwn(req.body, field)) {
      attribute.set(field, req.body[field]);
    }
  }
  await attribute.save();

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "ویژگی با موفقیت به‌روزرسانی شد",
      "Attribute updated successfully",
    ),
    data: attribute,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const attribute = await Attribute.findById(req.params.id);
  if (!attribute) {
    return next(
      new HandleERROR(
        getMessage(req, "ویژگی پیدا نشد", "Attribute not found"),
        404,
      ),
    );
  }
  await Attribute.findByIdAndDelete(attribute._id);

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "ویژگی با موفقیت حذف شد",
      "Attribute deleted successfully",
    ),
  });
});
