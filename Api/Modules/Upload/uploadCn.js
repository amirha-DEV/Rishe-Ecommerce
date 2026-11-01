import { catchAsync, HandleERROR } from "vanta-api";
import fs from "fs";
import { __dirname } from "../../app.js";

export const uploadSingle = catchAsync(async (req, res, next) => {
  const { file } = req;
  if (!file) {
    return next(new HandleERROR("failed to upload file", 400));
  }
  return res.status(201).json({
    success: true,
    data: file.filename,
    message: "upload successfully",
  });
});

export const uploadMulti = catchAsync(async (req, res, next) => {
  const { files } = req;
  if (!files) {
    return next(new HandleERROR("failed to upload file", 400));
  }
  const filenames = files?.map((item) => item.filename);
  return res.status(201).json({
    success: true,
    data: filenames,
    message: "upload successfully",
  });
});

export const removeFile = catchAsync(async (req, res, next) => {
  const filename = req.body?.filename ?? req.body;
  const removeName = filename?.split("/")?.at(-1);
  
  if (!removeName) {
    return next(new HandleERROR("file Not Found", 400));
  }
  
  if (fs.existsSync(`${__dirname}/Public/${removeName}`)) {
    fs.unlinkSync(`${__dirname}/Public/${removeName}`);
  } else {
    return next(new HandleERROR("file Not Found", 400));
  }
  
  return res.status(200).json({
    success: true,
    message: "file deleted",
  });
});