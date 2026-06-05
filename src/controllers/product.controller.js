const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const { client } = require("../config/redis")
const AppError = require("../utils/AppError");

exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        data: product
    })
});

exports.getProducts = asyncHandler(async (req, res) => {
    const { keyword = "", page = 1, limit = 10, category, minPrice, maxPrice } = req.query;

    const query = {};

    if (keyword) query.$text = { $search: keyword };
    if (category) query.category = category;

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const cacheKey = `products:${JSON.stringify(req.query)}`;

    let cachedProducts = null;
    if (client) {
        cachedProducts = await client.get(cacheKey);
    }

    if (cachedProducts) {
        return res.json({
            success: true,
            source: "redis",
            data: JSON.parse(cachedProducts)
        });
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
        .skip(skip)
        .limit(limitNum)
        .lean();

    const totalProducts = await Product.countDocuments(query);

    const responseData = {
        success: true,
        source: "mongodb",
        currentPage: pageNum,
        totalPages: Math.ceil(totalProducts / limitNum),
        totalProducts,
        data: products
    };

    if (client) {
        await client.set(cacheKey, JSON.stringify(responseData), { EX: 60 });
    }

    return res.json(responseData);
});

exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new AppError("Product not found", 404))

    res.json({
        success: true,
        data: product
    })
});


exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return next(new AppError("Product not found", 404));

    res.json({
        success: true,
        message: "Product updated successfully",
        data: product
    })
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError("Product not found", 404));

    res.json({
        success: true,
        message: "Product deleted",
    });
})
