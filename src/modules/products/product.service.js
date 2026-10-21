const Product = require("./product.model");
const productRepo = require("./product.repository");
const redis = require("../../config/queue");
const AppError = require("../../shared/errors/AppError");
// const elasticClient = require("../../config/elasticSearch");
const Upload = require("../uploads/upload.model");
const crawlerClient = require("./crawler.client");
// const logger = require("../../shared/utils/logger");

const validateImages = async (images, userId) => {
  if (!images || images.length === 0) {
    return [];
  }
  const uploads = await Upload.find({
    _id: { $in: images },
    user: userId,
    type: "product"
  });

  if (uploads.length !== images.length) {
    throw new AppError("Invalid product images", 400);
  }

  return uploads;


}

exports.createProduct = async (productData, userId) => {
  await validateImages(productData.images, userId);

  const product = await productRepo.create({ ...productData, seller: userId });

  // try {
  //   await elasticClient.index({
  //     index: "products",
  //     id: product._id.toString(),
  //     document: {
  //       name: product.name,
  //       description: product.description,
  //       category: product.category,
  //       price: product.price,
  //     },
  //   });
  // } catch (err) {
  //   logger.warn("Elasticsearch indexing failed for product", { id: product._id, error: err.message });
  // }

  return product;
};

exports.getProducts = async (queryData) => {
  const {
    keyword = "",
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
  } = queryData;

  const query = {};

  if (keyword) query.$text = { $search: keyword };
  if (category) query.category = category;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const cacheKey = `products:${JSON.stringify(queryData)}`;

  let cachedProducts = null;
  if (redis) {
    cachedProducts = await redis.get(cacheKey);
  }

  if (cachedProducts) {
    return {
      source: "redis",
      data: JSON.parse(cachedProducts),
    };
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(query).populate("images").skip(skip).limit(limitNum).lean();

  const totalProducts = await Product.countDocuments(query);

  const responseData = {
    source: "mongodb",
    currentPage: pageNum,
    totalPages: Math.ceil(totalProducts / limitNum),
    totalProducts,
    data: products,
  };

  if (redis) {
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 60);
  }

  return responseData;
};

exports.getProductById = async (id) => {
  const product = await Product.findById(id).populate("images");
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

exports.updateProduct = async (id, updateData, userId) => {
  await validateImages(updateData.images, userId)
  const product = await Product.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!product) throw new AppError("Product not found", 404);

  // try {
  //   await elasticClient.index({
  //     index: "products",
  //     id: product._id.toString(),
  //     document: {
  //       name: product.name,
  //       description: product.description,
  //       category: product.category,
  //       price: product.price,
  //     },
  //   });
  // } catch (err) {
  //   logger.warn("Elasticsearch re-indexing failed for product", { id: product._id, error: err.message });
  // }

  return product;
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);

  // try {
  //   await elasticClient.delete({
  //     index: "products",
  //     id: product._id.toString(),
  //   });
  // } catch (err) {
  //   logger.warn("Elasticsearch delete failed for product", { id: product._id, error: err.message });
  // }

  return product;
};

const SEARCH_CACHE_TTL_SECONDS = 15 * 60;

// Search is served by Crawler-Service (Amazon/Flipkart/Myntra), not the Mongo
// catalogue. A crawl is slow, so results are cached; a Redis failure only
// costs the cache, never the search.
exports.searchProducts = async (keyword) => {
  const q = keyword.trim().toLowerCase().replace(/\s+/g, " ");
  const cacheKey = `search:${q}`;

  if (redis) {
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) return JSON.parse(cached);
  }

  const result = await crawlerClient.search(q);

  // Don't pin an outage for 15 minutes: only cache if some store answered.
  const anySourceOk = (result.sources ?? []).some((source) => source.status === "ok");
  if (redis && anySourceOk) {
    await redis.set(cacheKey, JSON.stringify(result), "EX", SEARCH_CACHE_TTL_SECONDS).catch(() => {});
  }

  return result;
};
