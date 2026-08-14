const express = require("express");
const { protect, authorize } = require("../../shared/middlewares/auth.middleware");
const validate = require("../../shared/middlewares/validate.middleware");
const { createProductValidation, updateProductValidation } = require("./product.validation");
const router = express.Router();

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, searchProducts } = require("./product.controller");

// Reading the catalogue is public; writing to it is admin only.
router.route("/")
    .post(protect, authorize("admin"), createProductValidation, validate, createProduct)
    .get(getProducts);

router.get("/search", searchProducts);

router.route("/:id")
    .get(getProduct)
    .put(protect, authorize("admin"), updateProductValidation, validate, updateProduct)
    .delete(protect, authorize("admin"), deleteProduct);


module.exports = router;
