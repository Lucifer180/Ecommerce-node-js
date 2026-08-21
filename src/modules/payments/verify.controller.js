const asyncHandler = require("../../shared/utils/asyncHandler");
const AppError = require("../../shared/errors/AppError");
const Order = require("../orders/order.model");
const orderService = require("../orders/order.service");
const { isValidSignature } = require("./signature");

/**
 * Client-side payment handshake.
 *
 * A convenience path so the browser can show a result immediately; the webhook
 * is the authoritative one. Both funnel into the same idempotent status change,
 * so whichever arrives first wins and the second is a no-op.
 */
exports.verifyPayment = asyncHandler(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return next(new AppError("Incomplete payment payload", 400));
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;

    if (!isValidSignature(payload, razorpay_signature, process.env.RAZORPAY_KEY_SECRET)) {
        return next(new AppError("Payment verification failed", 400));
    }

    const order = await orderService.markOrderPaid(razorpay_order_id, razorpay_payment_id);

    // A null result means the webhook already settled this order. Fall back to
    // a scoped read so we never report on an order belonging to someone else.
    const settled = order || await Order.findOne({
        razorpayOrderId: razorpay_order_id,
        user: req.user._id
    });

    if (!settled) {
        return next(new AppError("Order not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
            orderId: settled._id,
            status: settled.status,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        }
    });
});
