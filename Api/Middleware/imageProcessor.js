import sharp from "sharp";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { __dirname } from "../app.js";
import { HandleERROR } from "vanta-api";

const processFile = async (file) => {
  const isImage = file.mimetype.startsWith("image/");
  const isSvg = file.mimetype === "image/svg+xml";
  const isGif = file.mimetype === "image/gif";

  const safeBaseName = path
    .basename(file.originalname, path.extname(file.originalname))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

  let filename = `${Date.now()}-${randomUUID()}${safeBaseName ? `-${safeBaseName}` : ""}`;
  let finalPath = "";
  let mimetype = file.mimetype;

  if (isImage && !isSvg) {
    filename = `${filename}.webp`;
    finalPath = path.join(__dirname, "Public", filename);
    mimetype = "image/webp";

    let sharpInstance;
    if (isGif) {
      sharpInstance = sharp(file.buffer, { animated: true });
    } else {
      sharpInstance = sharp(file.buffer);
    }

    await sharpInstance
      .webp({ quality: 80 })
      .toFile(finalPath);
  } else {
    const ext = path.extname(file.originalname).toLowerCase();
    filename = `${filename}${ext}`;
    finalPath = path.join(__dirname, "Public", filename);
    await fs.promises.writeFile(finalPath, file.buffer);
  }

  // Update file object properties for controllers downstream
  file.filename = filename;
  file.path = finalPath;
  file.mimetype = mimetype;
  file.size = fs.statSync(finalPath).size;
};

export const optimizeUploads = async (req, res, next) => {
  try {
    if (req.file) {
      await processFile(req.file);
    }
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await processFile(file);
      }
    }
    next();
  } catch (error) {
    next(new HandleERROR(`Image processing failed: ${error.message}`, 400));
  }
};
