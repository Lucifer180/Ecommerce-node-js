const Cart = require("./cart.model");

exports.findByUser = async (userId) => {
    return Cart.findOne({ user: userId });
};

exports.findByUserPopulated = async (userId) => {
    return Cart.findOne({ user: userId }).populate("items.product");
};

exports.create = async (userId, productId, quantity) => {
    return Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
    });
};

exports.save = async (cart) => {
    return cart.save();
};
