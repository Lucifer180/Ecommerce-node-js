const { body } = require("express-validator");

const recommendationValidation = [
    body("title")
        .isString()
        .withMessage("Title is required")
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Title must be 2-200 characters"),

    body("brand")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 60 })
        .withMessage("Brand must be at most 60 characters"),

    body("category")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 60 })
        .withMessage("Category must be at most 60 characters"),
];

module.exports = { recommendationValidation };
