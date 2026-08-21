const Order = require("./order.model");
const asyncHandler = require("../../shared/utils/asyncHandler");
const mongoose = require("mongoose");
const orderService = require("./order.service");

exports.createOrder = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();

    try {
        let order;

        // withTransaction (rather than a hand-rolled commit/abort) retries the
        // whole block on a TransientTransactionError, which is exactly what
        // MongoDB returns when two checkouts collide on the same product.
        await session.withTransaction(async () => {
            order = await orderService.createOrder(req.user._id, session);
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } finally {
        await session.endSession();
    }
});

exports.getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");

    res.json({
        success: true,
        data: orders
    });
});
