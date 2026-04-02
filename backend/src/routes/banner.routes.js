import express from "express";
import bannerController from "../controllers/banner.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", bannerController.getAll);
router.get("/:id", bannerController.getDetail);

// Admin protected routes
router.post("/", verifyToken, isAdmin, upload.single('image'), bannerController.create);
router.put("/:id", verifyToken, isAdmin, upload.single('image'), bannerController.update);
router.patch("/:id/toggle-status", verifyToken, isAdmin, bannerController.toggleStatus);
router.delete("/:id", verifyToken, isAdmin, bannerController.delete);

export default router;
