const Order = require("../models/orderSchema.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");


exports.createOrder = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product").session(session);
        if (!cart || cart.items.length === 0) {
            throw new AppError("Cart is empty", 400);
        };
        let totalPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = await Product.findById(item.product._id).session(session);

            if (!product || product.stock < item.quantity) {
                throw new AppError(`Insufficient stock for ${product.name}`, 400);
            }
            totalPrice += item.quantity * product.price;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            })
            product.stock -= item.quantity;
            await product.save({ session })

        }
        const order = await Order.create([{
            user: req.user._id,
            items: orderItems,
            totalPrice: totalPrice,
        }], { session });

        cart.items = [];
        await cart.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: "order placed successfully",
            data: order[0]
        })
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        next(e);
    }
});

exports.getMyOrders = asyncHandler(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id }).populate("items.product");

    res.json({
        success: true,
        data: orders
    })
})