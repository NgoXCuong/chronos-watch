import express from "express";
import adminController from "../controllers/admin.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, adminController.getDashboard);
router.get("/users", verifyToken, isAdmin, adminController.getAllUsers);
router.get("/orders", verifyToken, isAdmin, adminController.getAllOrders);
router.get("/orders/:id", verifyToken, isAdmin, adminController.getOrderDetail);

router.get("/notifications", verifyToken, isAdmin, adminController.getNotifications);
router.get("/reviews", verifyToken, isAdmin, adminController.getAllReviews);
router.patch("/reviews/:id/status", verifyToken, isAdmin, adminController.updateReviewStatus);
router.post("/reviews/:id/reply", verifyToken, isAdmin, adminController.replyToReview);

export default router;
