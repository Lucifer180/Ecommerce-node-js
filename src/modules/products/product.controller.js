const productService = require("./product.service");
const asyncHandler = require("../../shared/utils/asyncHandler");

exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.createProduct(req.body, req.user.id);

  res.status(201).json({
    success: true,
    data: product,
  });
});

exports.getProducts = asyncHandler(async (req, res) => {
  const result = await productService.getProducts(req.query);

  return res.json({
    success: true,
    ...result,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);

  res.json({
    success: true,
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user.id);

  res.json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  await productService.deleteProduct(req.params.id);

  res.json({
    success: true,
    message: "Product deleted",
  });
});

exports.searchProducts = asyncHandler(async (req, res) => {
  const keyword = typeof req.query.keyword === "string" ? req.query.keyword.trim() : "";

  if (keyword.length < 2 || keyword.length > 120) {
    return res.status(400).json({
      success: false,
      message: "Keyword must be 2-120 characters",
    });
  }

  const result = await productService.searchProducts(keyword);

  res.json({
    success: true,
    data: result,
  });
});
