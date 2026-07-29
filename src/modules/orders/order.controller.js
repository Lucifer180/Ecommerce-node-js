const Order = require("./order.model");
const asyncHandler = require("../../shared/utils/asyncHandler");
const mongoose = require("mongoose");
const orderService = require("./order.service")

exports.createOrder = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await orderService.createOrder(req._id, session);
        await session.commitTransaction();
        res.status(201).json({
            success: true,
            data: order
        });
    } catch (e) {
        await session.abortTransaction();
        throw e;
    } finally {
        session.endSession();
    }
});

exports.getMyOrders = asyncHandler(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id }).populate("items.product");

    res.json({
        success: true,
        data: orders
    })
})
