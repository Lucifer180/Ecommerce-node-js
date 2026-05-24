const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");;
const AppError = require("../utils/AppError");

exports.addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return next(new AppError("product not found", 404));

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{ product: productId, quantity }]
        })
    } else {
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId.toString());

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }
    res.json({ success: true, data: cart });
});

exports.getCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    return res.json({ success: true, data: cart });
});

exports.updateCartItem = asyncHandler(async () => {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.find((i) => i.product.toString() === productId.toString());

    if (!item) { throw new AppError("item not in cart", 404) };

    item.quantity = quantity;
    await cart.save();

    res.json({ success: true, data: cart });
});

exports.removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId.toString());

    await cart.save();

    res.json({ success: true, data: cart });

})