import express from "express";
import productController from "../controllers/product.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", productController.getAll);
router.get("/:id_or_slug", productController.getDetail);

// Admin only routes
router.post("/", verifyToken, isAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), productController.create);
router.put("/:id", verifyToken, isAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), productController.update);
router.delete("/:id", verifyToken, isAdmin, productController.delete);

export default router;
