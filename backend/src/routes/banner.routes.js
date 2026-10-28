import express from "express";
import bannerController from "../controllers/banner.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import { bannerUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public: Hero slider trang chủ
router.get("/", bannerController.getActive);

// Admin only routes
router.get("/all", verifyToken, isAdmin, bannerController.getAll);
router.post("/", verifyToken, isAdmin, bannerUpload.single('image'), bannerController.create);
router.put("/:id", verifyToken, isAdmin, bannerUpload.single('image'), bannerController.update);
router.patch("/status/bulk", verifyToken, isAdmin, bannerController.bulkUpdateVisibility);
router.patch("/:id/toggle-status", verifyToken, isAdmin, bannerController.toggleStatus);
// "bulk" phải đăng ký trước "/:id" nếu không bị match thành id
router.delete("/bulk", verifyToken, isAdmin, bannerController.bulkDelete);
router.delete("/:id", verifyToken, isAdmin, bannerController.delete);

export default router;
