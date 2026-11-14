import express from "express";
import { catchError } from "vanta-api";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import { exportValidation } from "./Middleware/exportValidation.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./Utils/Swagger.js";
import userRouter from "./Modules/User/user.js";
import authRouter from "./Modules/Auth/auth.js";
import productRouter from "./Modules/Product/product.js";
import brandRouter from "./Modules/Brand/brand.js";
import categoryRouter from "./Modules/Category/category.js";
import commentRouter from "./Modules/Comment/comment.js";
import discountRouter from "./Modules/Discount/discount.js";
import searchRouter from "./Modules/Search/search.js";
import addressRouter from "./Modules/Address/address.js";
import isLogin from "./Middleware/isLogin.js";
import sliderRouter from "./Modules/Slider/slider.js";
import attributeRouter from "./Modules/Attribute/attribute.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(`${__dirname}/public`));
app.use(exportValidation);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/brands", brandRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);
app.use("/api/discounts", discountRouter);
app.use("/api/search", searchRouter);
app.use("/api/addresses", isLogin, addressRouter);
app.use("/api/sliders", sliderRouter);
app.use("/api/attributes", attributeRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use(catchError);
export default app;
