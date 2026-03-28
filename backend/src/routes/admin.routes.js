import express from "express";
import adminController from "../controllers/admin.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, adminController.getDashboard);

export default router;
