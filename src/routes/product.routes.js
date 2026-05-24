const express = require("express");
const {protect} = require("../middlewares/auth.middleware")
const router = express.Router();

const { createProduct, getProducts,getProduct,updateProduct,deleteProduct } = require("../controllers/product.controller");

router.route("/")
                .post(protect,createProduct)
                .get(getProducts);
router.route("/:id")
                .get(getProduct)
                .put(protect,updateProduct)
                .delete(protect,deleteProduct);

module.exports = router;

