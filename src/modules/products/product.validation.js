const { body } = require("express-validator");

const createProductValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),

    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be blank"),

    body("images")
        .optional()
        .isArray()
        .withMessage("Images must be an array of upload IDs"),
];

const updateProductValidation = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product name cannot be blank"),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
];

module.exports = { createProductValidation, updateProductValidation };
