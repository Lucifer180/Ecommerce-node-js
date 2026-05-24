const express = require("express");
const router = express.Router();

const { createOrder, getMyOrders } = require("../controllers/orderController");
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post("/", createOrder);
router.get("/my", getMyOrders);

module.exports = router;