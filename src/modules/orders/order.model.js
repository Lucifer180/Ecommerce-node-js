const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: Number,
        // Price is copied in at checkout so a later catalogue edit cannot
        // rewrite what the customer was charged.
        price: Number,
    }],
    totalPrice: Number,
    status: {
        type: String,
        enum: ["pending", "paid", "failed", "shipped", "delivered"],
        default: "pending"
    },
    // Set when a Razorpay order is opened for this order; the webhook and the
    // client callback both look the order up by it.
    razorpayOrderId: {
        type: String,
        index: { unique: true, sparse: true }
    },
    razorpayPaymentId: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
