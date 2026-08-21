const express = require("express");
const router = express.Router();

const { createPaymentOrder, webhookHandler } = require("./payment.controller");
const { verifyPayment } = require("./verify.controller");

const { protect } = require("../../shared/middlewares/auth.middleware");

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

// Called by Razorpay, not by a logged-in user — authenticated by HMAC
// signature instead of a bearer token. See webhookHandler.
router.post("/webhook", webhookHandler);

module.exports = router;
