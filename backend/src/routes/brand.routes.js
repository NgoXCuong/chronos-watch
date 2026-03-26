import express from "express";
import brandController from "../controllers/brand.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", brandController.getAll);
router.get("/:id_or_slug", brandController.getDetail);

// Admin only routes
router.post("/", verifyToken, isAdmin, brandController.create);
router.put("/:id", verifyToken, isAdmin, brandController.update);
router.delete("/:id", verifyToken, isAdmin, brandController.delete);

export default router;
