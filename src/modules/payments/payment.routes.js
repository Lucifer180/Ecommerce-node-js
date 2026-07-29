const express = require("express");
const router = express.Router();

const { createPaymentOrder } = require("./payment.controller");
const { verifyPayment } = require("./verify.controller");

const { protect } = require("../../shared/middlewares/auth.middleware");

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
