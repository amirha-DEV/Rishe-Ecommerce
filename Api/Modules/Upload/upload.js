import { Router } from "express";
import upload from "../../Utils/uploadSetting.js";
import { optimizeUploads } from "../../Middleware/imageProcessor.js";
import { removeFile, uploadMulti, uploadSingle } from "./uploadCn.js";

const uploadRouter = Router();

uploadRouter
  .route("/")
  .post(upload.single("file"), optimizeUploads, uploadSingle)
  .delete(removeFile);

uploadRouter
  .route("/multi")
  .post(upload.array("files", 10), optimizeUploads, uploadMulti);

export default uploadRouter;