const Order = require("../models/orderSchema.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

const createOrder = async (userId, session) => {
    const cart = await Cart.findOne({
        user: userId
    }).populate("items.product");

    if (!cart || !cart.items.length) {
        throw new ApiError("Cart is empty", 400);
    };

    let totalPrice = 0;
    let orderItems = [];

    for (const item of cart.items) {
        const product = await Product.findById(item.product._id);

        if (product.stock < item.quantity) {
            throw new Error("insufficient stock ");
        };

        product.stock -= item.quantity;

        await product.save();

        totalPrice += product.price * item.quantity;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
        });
    }
    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalPrice
    }, { session });

    cart.items = [];

    await cart.save({ session });
    return order[0];
};

module.exports = { createOrder }