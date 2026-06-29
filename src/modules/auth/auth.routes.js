const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

const { registerValidation, loginValidation } = require("./auth.validation");

const validate = require("../../shared/middlewares/validate.middleware");
const { protect } = require("../../shared/middlewares/auth.middleware");

router.post("/register", registerValidation, validate, authController.register);

router.post("/login", loginValidation, validate, authController.login);

router.get("/me", protect, authController.getMe);

module.exports = router;
