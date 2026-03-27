import express from "express";
import cartController from "../controllers/cart.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

// Tất cả các route giỏ hàng đều yêu cầu đăng nhập
router.use(verifyToken);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateQuantity);
router.delete("/remove/:productId", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

export default router;
