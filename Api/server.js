import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
dotenv.config();
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.DATA_BASE, {
    dbName: process.env.DATABASE_NAME,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
