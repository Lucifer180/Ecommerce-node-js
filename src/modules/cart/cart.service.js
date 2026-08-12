const cartRepo = require("./cart.repository");
const Product = require("../products/product.model");
const AppError = require("../../shared/errors/AppError");

exports.addToCart = async (userId, productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    let cart = await cartRepo.findByUser(userId);

    if (!cart) {
        cart = await cartRepo.create(userId, productId, quantity);
    } else {
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId.toString()
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cartRepo.save(cart);
    }

    return cart;
};

exports.getCart = async (userId) => {
    const cart = await cartRepo.findByUserPopulated(userId);
    return cart;
};

exports.updateCartItem = async (userId, productId, quantity) => {
    const cart = await cartRepo.findByUser(userId);

    if (!cart) throw new AppError("Cart not found", 404);

    const item = cart.items.find(
        (i) => i.product.toString() === productId.toString()
    );

    if (!item) throw new AppError("Item not in cart", 404);

    item.quantity = quantity;
    await cartRepo.save(cart);

    return cart;
};

exports.removeCartItem = async (userId, productId) => {
    const cart = await cartRepo.findByUser(userId);

    if (!cart) throw new AppError("Cart not found", 404);

    cart.items = cart.items.filter(
        (i) => i.product.toString() !== productId.toString()
    );

    await cartRepo.save(cart);

    return cart;
};
