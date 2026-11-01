import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Category from "../Category/categoryMd.js";
import Product from "../Product/productMd.js";
import Brand from "../Brand/brandMd.js";

export const search = catchAsync(async (req, res, next) => {
  const isAdminUser = req.role === "admin" || req.role === "superAdmin";

  const productCondition = isAdminUser ? {} : { isPublished: true };
  const categoryCondition = isAdminUser ? {} : { isActive: true };
  const brandCondition = isAdminUser ? {} : { isActive: true };

  const featuresCat = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(categoryCondition)
    .filter()
    .search(["name.fa", "name.en"])
    .sort()
    .paginate();

  const featuresPr = new ApiFeatures(Product, req.query, req.role)
    .addManualFilters(productCondition)
    .filter()
    .search(["title.fa", "title.en", "tags.fa", "tags.en"])
    .sort()
    .paginate()
    .populate([
      { path: "brandId", select: "title" },
      { path: "categoryIds", select: "title" },
      { path: "variantIds" },
      { path: "defaultProductVariantIds", populate: { path: "variantId" } },
    ]);

  const featuresBr = new ApiFeatures(Brand, req.query, req.role)
    .addManualFilters(brandCondition)
    .filter()
    .search(["name.fa", "name.en"])
    .sort()
    .paginate();

  const [brands, categories, products] = await Promise.all([
    featuresBr.execute(),
    featuresCat.execute(),
    featuresPr.execute(),
  ]);

  if (brands.count === 0 && categories.count === 0 && products.count === 0) {
    return next(new HandleERROR("Not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: {
      brands: brands.data,
      categories: categories.data,
      products: products.data,
    },
  });
});
