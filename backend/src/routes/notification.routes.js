import express from "express";
import notificationController from "../controllers/notification.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// Dùng chung cho khách và admin: mỗi người chỉ thấy thông báo của chính mình.
router.get("/", verifyToken, notificationController.list);
// /read-all phải đứng trước /:id/read để không bị hiểu là id
router.patch("/read-all", verifyToken, notificationController.markAllRead);
router.patch("/:id/read", verifyToken, notificationController.markRead);

export default router;
