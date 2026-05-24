const express = require("express");
const router = express.Router();

const { addToCart, getCart, updateCartItem, removeCartItem } = require("../controllers/cart.controller");

const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.post("/", addToCart);
router.get("/", getCart);
router.put("/", updateCartItem);
router.delete("/", removeCartItem);

module.exports = router;

