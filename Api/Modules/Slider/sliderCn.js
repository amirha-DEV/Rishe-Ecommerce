import ApiFeatures, { catchAsync } from "vanta-api";
import Slider from "./sliderMd.js";
import { imageHandler } from "../../Utils/imageHandler.js";
import fs from "fs";
import { __dirname } from "../../app.js";

const getMessage = (req, fa, en) => {
  const language = (req.headers["accept-language"] || "fa")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();

  return language === "en" ? en : fa;
};

// Get ALl Slider
export const getAll = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "admin" || req.role === "superAdmin"
      ? {}
      : { isPublished: true };

  const features = new ApiFeatures(Slider, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search(["title.fa", "title.en"])
    .sort()
    .paginate();
  const result = await features.execute();
  return res.status(200).json(result);
});

// Get One Slider
export const getOne = catchAsync(async (req, res, next) => {
  const condition =
    req.role === "admin" || req.role === "superAdmin"
      ? { _id: req.params.id }
      : { _id: req.params.id, isPublished: true };

  const result = await Slider.findOne(condition);

  if (!result) {
    return next(
      new HandleERROR(
        getMessage(req, "slider not found", "اسلایدر پیدا نشد"),
        404,
      ),
    );
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
});

// Create Slider
export const create = catchAsync(async (req, res, next) => {
  const slider = await Slider.create(req.body);

  return res.status(201).json({
    success: true,
    message: getMessage(
      req,
      "slider created successfully",
      "اسلایدر با موفقیت ساخته شد",
    ),
    data: slider,
  });
});

// Update Slider
export const update = catchAsync(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);

  if (!slider) {
    return next(new HandleERROR("اسلایدر مورد نظر پیدا نشد", 404));
  }

  const updateSlider = await Slider.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (slider.image && req.body.image && slider.image !== req.body.image) {
    await imageHandler([slider.image], [req.body.image]);
  }

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "اسلایدر با موفقیت بروزرسانی شد",
      "Slider updated successfully",
    ),
    data: updateSlider,
  });
});

// Delete Slider
export const remove = catchAsync(async (req, res, next) => {
  const slider = await Slider.findByIdAndDelete(req.params.id);

  if (!slider) {
    return next(new HandleERROR("اسلایدر مورد نظر پیدا نشد", 404));
  }

  if (slider.image) {
    const imagePath = `${__dirname}/Public/${slider.image}`;

    if (fs.existsSync(imagePath)) {
      await fs.promises.unlink(imagePath);
    }
  }

  return res.status(200).json({
    success: true,
    message: getMessage(
      req,
      "اسلایدر با موفقیت حذف شد",
      "Slider deleted successfully",
    ),
  });
});
