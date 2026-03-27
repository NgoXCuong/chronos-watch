import express from "express";
import orderController from "../controllers/order.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/checkout", orderController.checkout);
router.get("/my-orders", orderController.getMyOrders);
router.get("/:id", orderController.getDetail);
router.post("/:id/cancel", orderController.cancelOrder);

// Admin routes
router.patch("/:id/status", isAdmin, orderController.updateStatus);

export default router;
