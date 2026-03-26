import express from "express";
import authController from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Private routes (requires Login)
router.get("/profile", verifyToken, authController.getProfile);
router.post("/logout", verifyToken, authController.logout);
router.put("/change-password", verifyToken, authController.changePassword);

export default router;
