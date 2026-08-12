const express = require("express");
const { protect } = require("../../shared/middlewares/auth.middleware");
const validate = require("../../shared/middlewares/validate.middleware");
const { createProductValidation, updateProductValidation } = require("./product.validation");
const router = express.Router();

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, searchProducts } = require("./product.controller");

router.route("/")
    .post(protect, createProductValidation, validate, createProduct)
    .get(getProducts);

router.get("/search", searchProducts);

router.route("/:id")
    .get(getProduct)
    .put(protect, updateProductValidation, validate, updateProduct)
    .delete(protect, deleteProduct);


module.exports = router;
