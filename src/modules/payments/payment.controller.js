const razorpay = require("../../config/razorpay");
const asyncHandler = require("../../shared/utils/asyncHandler");
const AppError = require("../../shared/errors/AppError");
const logger = require("../../shared/utils/logger");
const Order = require("../orders/order.model");
const orderService = require("../orders/order.service");
const { isValidSignature } = require("./signature");

/**
 * Opens a Razorpay order for one of our own orders.
 *
 * The amount is read from the stored order, never from the request body — a
 * client-supplied amount would let anyone check out a full cart for one rupee.
 */
exports.createPaymentOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.body;

    if (!orderId) {
        return next(new AppError("orderId is required", 400));
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
        return next(new AppError("Order not found", 404));
    }

    if (order.status !== "pending") {
        return next(new AppError(`Order is already ${order.status}`, 409));
    }

    // Reuse the existing Razorpay order if the client retries checkout, so a
    // double-click cannot open two payable orders against one cart.
    if (order.razorpayOrderId) {
        const existing = await razorpay.orders.fetch(order.razorpayOrderId);

        return res.status(200).json({
            success: true,
            order: existing,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    }

    const paymentOrder = await razorpay.orders.create({
        // Razorpay works in paise; round to guard against float drift.
        amount: Math.round(order.totalPrice * 100),
        currency: "INR",
        receipt: order._id.toString(),
        notes: {
            orderId: order._id.toString(),
            userId: req.user._id.toString()
        }
    });

    order.razorpayOrderId = paymentOrder.id;
    await order.save();

    res.status(200).json({
        success: true,
        order: paymentOrder,
        keyId: process.env.RAZORPAY_KEY_ID
    });
});

/**
 * Razorpay webhook — the authoritative record of what happened to a payment.
 *
 * The browser callback can be skipped entirely (closed tab, dead connection),
 * so this endpoint, not /verify, is what an order's status ultimately rests on.
 * It is unauthenticated by necessity, which makes the signature check the only
 * thing standing between a stranger and a free order.
 */
exports.webhookHandler = asyncHandler(async (req, res, next) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
        logger.error("RAZORPAY_WEBHOOK_SECRET is not configured");
        return next(new AppError("Webhook not configured", 500));
    }

    // req.rawBody is captured by the express.json verify hook in app.js: the
    // signature covers the exact bytes Razorpay sent, and re-serialising the
    // parsed object would not reproduce them.
    const signature = req.headers["x-razorpay-signature"];

    if (!isValidSignature(req.rawBody, signature, secret)) {
        logger.warn("Rejected Razorpay webhook with an invalid signature");
        return next(new AppError("Invalid webhook signature", 400));
    }

    const event = req.body?.event;
    const payment = req.body?.payload?.payment?.entity;

    if (!payment?.order_id) {
        // Signed, but not a shape we act on (refunds, subscriptions, ...).
        return res.status(200).json({ success: true, ignored: event });
    }

    switch (event) {
        case "payment.captured": {
            const order = await orderService.markOrderPaid(payment.order_id, payment.id);

            logger.info("Webhook: payment captured", {
                razorpayOrderId: payment.order_id,
                // A null order means a duplicate delivery, not a problem.
                applied: Boolean(order)
            });
            break;
        }

        case "payment.failed": {
            const order = await orderService.markOrderFailed(payment.order_id, payment.id);

            logger.info("Webhook: payment failed, reserved stock released", {
                razorpayOrderId: payment.order_id,
                applied: Boolean(order)
            });
            break;
        }

        default:
            logger.info("Webhook: unhandled event", { event });
    }

    // Always 200 on a verified event — a non-2xx makes Razorpay retry, and
    // replaying an event we have already applied achieves nothing.
    res.status(200).json({ success: true });
});
