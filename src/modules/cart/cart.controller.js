const cartService = require("./cart.service");
const asyncHandler = require("../../shared/utils/asyncHandler");

exports.addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await cartService.addToCart(req.user._id, productId, quantity);

    res.json({ success: true, data: cart });
});

exports.getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);

    res.json({ success: true, data: cart });
});

exports.updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await cartService.updateCartItem(req.user._id, productId, quantity);

    res.json({ success: true, data: cart });
});

exports.removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    const cart = await cartService.removeCartItem(req.user._id, productId);

    res.json({ success: true, data: cart });
});
