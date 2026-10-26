import mongoose from "mongoose";

const seoSchema = new mongoose.Schema({
  // فیلدهای مدل SEO
});

const Seo = mongoose.model("Seo", seoSchema);

export default Seo;