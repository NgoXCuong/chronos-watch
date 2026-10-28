import express from "express";
import productController from "../controllers/product.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", productController.getAll);
// /facets PHẢI đứng trước /:id_or_slug — nếu không nó bị match thành slug "facets" (404)
router.get("/facets", productController.getFacets);
// Admin routes đứng trước /:id_or_slug để "admin" không bị hiểu là slug sản phẩm.
router.get("/admin", verifyToken, isAdmin, productController.getAdminAll);
router.get("/admin/:id", verifyToken, isAdmin, productController.getAdminDetail);
router.get("/:id_or_slug/related", productController.getRelated);
router.get("/:id_or_slug", productController.getDetail);

// Admin only routes
router.post("/", verifyToken, isAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), productController.create);
router.put("/:id", verifyToken, isAdmin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), productController.update);
router.patch("/status/bulk", verifyToken, isAdmin, productController.bulkUpdateStatus);
router.delete("/:id", verifyToken, isAdmin, productController.delete);

export default router;
