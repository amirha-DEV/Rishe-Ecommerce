import { Router } from "express";

import { create, getAll, getOne, remove, update } from "./sliderCn.js";

import isAdmin from "../../Middleware/isAdmin.js";

import {
  createSliderValidator,
  updateSliderValidator,
  sliderIdValidator,
} from "./sliderValidator.js";

const sliderRouter = Router();

sliderRouter
  .route("/")
  .get(getAll)
  .post(isAdmin, createSliderValidator, create);

sliderRouter
  .route("/:id")
  .get(sliderIdValidator, getOne)
  .patch(isAdmin, updateSliderValidator, update)
  .delete(isAdmin, sliderIdValidator, remove);

export default sliderRouter;
