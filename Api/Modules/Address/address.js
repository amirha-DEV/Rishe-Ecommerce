import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./addressCn.js";

import {
  addressIdValidator,
  createAddressValidator,
  updateAddressValidator,
} from "./addressValidator.js";

const addressRouter = Router();

addressRouter.route("/").get(getAll).post(createAddressValidator, create);

addressRouter
  .route("/:id")
  .get(addressIdValidator, getOne)
  .patch(updateAddressValidator, update)
  .delete(addressIdValidator, remove);

export default addressRouter;
