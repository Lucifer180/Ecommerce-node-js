const express = require("express");
const router = express.Router();

const { createPaymentOrder } = require("../controllers/payment.controller");
const { verifyPayment } = require("../controllers/verify.controller");

const { protect } = require("../middlewares/auth.middleware");

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;