const crypto = require("crypto");
const asyncHandler = require("../../shared/utils/asyncHandler");
const AppError = require("../../shared/errors/AppError");

exports.verifyPayment = asyncHandler(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return next(new AppError("Payment verification failed", 400));
    };

    res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        status: "paid",
        data: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        }
    })
})
