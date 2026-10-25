import express from "express";
import { catchError } from "vanta-api";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import { exportValidation } from "./Middleware/exportValidation.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./Utils/Swagger.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(`${__dirname}/public`));
app.use(exportValidation);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use(catchError);
export default app;
