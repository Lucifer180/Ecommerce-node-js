const express = require("express");
const rateLimit = require("express-rate-limit");
const validate = require("../../shared/middlewares/validate.middleware");
const { recommendationValidation } = require("./recommendation.validation");
const { getRecommendations } = require("./recommendation.controller");

const router = express.Router();

// Every uncached call is a paid LLM request, so this gets a tighter budget
// than the global /api limiter.
const recommendationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, message: "Too many suggestion requests, try again later" },
});

// Public, like product search: suggestions are for browsing, not account data.
router.post("/", recommendationLimiter, recommendationValidation, validate, getRecommendations);

module.exports = router;
