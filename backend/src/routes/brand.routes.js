import express from "express";
import brandController from "../controllers/brand.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", brandController.getAll);
router.get("/:id_or_slug", brandController.getDetail);

// Admin only routes
router.post("/", verifyToken, isAdmin, upload.single('logo'), brandController.create);
router.put("/:id", verifyToken, isAdmin, upload.single('logo'), brandController.update);
router.patch("/status/bulk", verifyToken, isAdmin, brandController.bulkUpdateVisibility);
router.patch("/:id/toggle-status", verifyToken, isAdmin, brandController.toggleStatus);
// "bulk" phải đăng ký trước "/:id" nếu không bị match thành id
router.delete("/bulk", verifyToken, isAdmin, brandController.bulkDelete);
router.delete("/:id", verifyToken, isAdmin, brandController.delete);

export default router;
