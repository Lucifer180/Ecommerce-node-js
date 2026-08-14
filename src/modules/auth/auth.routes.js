const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");

const { registerValidation, loginValidation } = require("./auth.validation");

const validate = require("../../shared/middlewares/validate.middleware");
const { protect, authorize } = require("../../shared/middlewares/auth.middleware");

router.post("/register", registerValidation, validate, authController.register);

router.post("/login", loginValidation, validate, authController.login);

router.get("/me", protect, authController.getMe);

router.post("/refreshToken", authController.refreshToken);

router.post("/logout", protect, authController.logout);

router.post("/forgot-password", authController.getForgotPassword);

router.patch("/reset-password/:token", authController.ResetPassword);

// Admin only: listing every user and changing roles are both privileged.
router.get("/", protect, authorize("admin"), authController.getUsers);

router.put("/", protect, authorize("admin"), authController.updateRole);

module.exports = router;
