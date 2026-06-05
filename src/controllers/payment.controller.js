const razorpay = require("../config/razorpay");
const asyncHandler = require("../utils/asyncHandler");

exports.createPaymentOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
        success: true,
        order
    });
});

exports.webhookHandler = asyncHandler(async (req, res)=>{
    const event = req.body;
    console.log(event);

    res.status(200).json({
        success: true,
        message: "Webhook received successfully"
    })
})