const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

const { registerValidation, loginValidation } = require("./auth.validation");

const validate = require("../../shared/middlewares/validate.middleware");
const { protect } = require("../../shared/middlewares/auth.middleware");

router.post("/register", registerValidation, validate, authController.register);

router.post("/login", loginValidation, validate, authController.login);

router.get("/me", protect, authController.getMe);

router.post("/refreshToken", authController.refreshToken);

router.post("/logout", protect, authController.logout);

router.post("/forgot-password", authController.getForgotPassword);

router.patch("/reset-password/:token", authController.ResetPassword);

router.get("/", authController.getUsers);

router.put("/",protect,authController.updateRole)

module.exports = router;
