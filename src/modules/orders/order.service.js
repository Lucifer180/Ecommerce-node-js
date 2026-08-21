const mongoose = require("mongoose");
const Order = require("./order.model");
const Product = require("../products/product.model");
const Cart = require("../cart/cart.model");
const AppError = require("../../shared/errors/AppError");

/**
 * Returns reserved units to the catalogue. Callers must pass the session of an
 * open transaction so the restock commits atomically with the status change
 * that justified it.
 */
const restoreStock = async (order, session) => {
    for (const item of order.items) {
        await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
            { session }
        );
    }
};

/**
 * Places an order for everything currently in the user's cart.
 *
 * Stock is decremented with one guarded update per line item: MongoDB evaluates
 * the `stock: { $gte: quantity }` filter and the `$inc` as a single atomic
 * operation, so two concurrent checkouts cannot both pass the check and
 * oversell the same unit. Every read and write runs inside the caller's
 * session, so aborting the transaction rolls the stock back with the order.
 */
const createOrder = async (userId, session) => {
    const cart = await Cart.findOne({ user: userId }).session(session);

    if (!cart || !cart.items.length) {
        throw new AppError("Cart is empty", 400);
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
        if (!Number.isInteger(item.quantity) || item.quantity < 1) {
            throw new AppError("Invalid quantity in cart", 400);
        }

        const product = await Product.findOneAndUpdate(
            { _id: item.product, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } },
            { returnDocument: "after", session }
        );

        // No match means either the product is gone or another checkout took
        // the units between this user filling their cart and paying.
        if (!product) {
            const stillExists = await Product.findById(item.product)
                .select("_id")
                .session(session);

            throw new AppError(
                stillExists ? "Insufficient stock" : "Product no longer available",
                409
            );
        }

        totalPrice += product.price * item.quantity;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
        });
    }

    const [order] = await Order.create([{
        user: userId,
        items: orderItems,
        totalPrice
    }], { session });

    cart.items = [];
    await cart.save({ session });

    return order;
};

/**
 * Flips a pending order to `paid`.
 *
 * The `status: "pending"` filter is what makes this idempotent, and that
 * matters: Razorpay confirms a payment twice by design (the browser callback
 * and the server webhook) and retries the webhook on any non-2xx. Returns null
 * when the order was already settled, which callers treat as success.
 */
const markOrderPaid = async (razorpayOrderId, razorpayPaymentId) =>
    Order.findOneAndUpdate(
        { razorpayOrderId, status: "pending" },
        { status: "paid", razorpayPaymentId },
        { returnDocument: "after" }
    );

/**
 * Marks a pending order failed and returns its reserved stock to the catalogue.
 *
 * Runs in its own transaction so the status change and the restock commit
 * together — a crash between them would otherwise strand inventory that no
 * order will ever ship. Idempotent for the same reason as `markOrderPaid`.
 */
const markOrderFailed = async (razorpayOrderId, razorpayPaymentId) => {
    const session = await mongoose.startSession();

    try {
        let failedOrder = null;

        await session.withTransaction(async () => {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId, status: "pending" },
                { status: "failed", razorpayPaymentId },
                { returnDocument: "after", session }
            );

            // Already settled by an earlier delivery of this event.
            if (!order) return;

            await restoreStock(order, session);
            failedOrder = order;
        });

        return failedOrder;
    } finally {
        await session.endSession();
    }
};

module.exports = { createOrder, markOrderPaid, markOrderFailed };
