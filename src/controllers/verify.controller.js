const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");

exports.verifyPayment = asyncHandler(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return next(new AppError("Payment verification failed", 400));
    };

    res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        }
    })
})