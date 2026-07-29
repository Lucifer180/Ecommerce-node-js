const express = require("express");
const router = express.Router();

const { createOrder, getMyOrders } = require("./order.controller");
const { protect } = require('../../shared/middlewares/auth.middleware');

router.use(protect);

router.post("/", createOrder);
router.get("/my", getMyOrders);

module.exports = router;
