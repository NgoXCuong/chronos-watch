import express from "express";
import categoryController from "../controllers/category.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", categoryController.getAll);
router.get("/:id_or_slug", categoryController.getDetail);

// Admin only routes
router.post("/", verifyToken, isAdmin, categoryController.create);
router.put("/:id", verifyToken, isAdmin, categoryController.update);
router.patch("/:id/toggle-status", verifyToken, isAdmin, categoryController.toggleStatus);
router.delete("/:id", verifyToken, isAdmin, categoryController.delete);

export default router;
