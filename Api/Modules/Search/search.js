import { Router } from "express";
import { search } from "./searchCn.js";
import { searchValidator } from "./searchValidator.js";

const searchRouter = Router();

searchRouter.route("/").get(searchValidator, search);

export default searchRouter;
