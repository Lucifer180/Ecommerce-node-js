const { body } = require("express-validator");

const registerValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),

    body("email").isEmail().withMessage("valid email is required"),

    body("password").isLength({ min: 8 }).withMessage("password must be at least 8 characters")
];

const loginValidation = [
    body("email").isEmail().withMessage("valid email is required"),

    body("password").notEmpty().withMessage("password is required"),
];

module.exports = {
    registerValidation,
    loginValidation
}