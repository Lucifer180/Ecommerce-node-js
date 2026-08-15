const express = require("express");
const router = express.Router();

const { sendNotification } = require("./notification.controller");
const { protect, authorize } = require("../../shared/middlewares/auth.middleware");

// Sending mail to the user base is admin only.
router.post("/", protect, authorize("admin"), sendNotification);

module.exports = router;
