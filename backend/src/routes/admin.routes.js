import express from "express";
import adminController from "../controllers/admin.controller.js";
import adminWarrantyController from "../controllers/admin-warranty.controller.js";
import adminFlashSaleController from "../controllers/admin-flash-sale.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, adminController.getDashboard);
router.get("/users/stats", verifyToken, isAdmin, adminController.getUserStats);
// /users/:id đặt SAU các route /users/... cố định để "stats" không bị hiểu là id
router.get("/users/:id", verifyToken, isAdmin, adminController.getUserDetail);
router.patch(
  "/users/status/bulk",
  verifyToken,
  isAdmin,
  adminController.bulkUpdateUserStatus,
);
router.get("/users", verifyToken, isAdmin, adminController.getAllUsers);
router.get("/orders", verifyToken, isAdmin, adminController.getAllOrders);
router.get("/orders/:id", verifyToken, isAdmin, adminController.getOrderDetail);

router.get("/reviews", verifyToken, isAdmin, adminController.getAllReviews);
router.get(
  "/reviews/stats",
  verifyToken,
  isAdmin,
  adminController.getReviewStats,
);
router.patch(
  "/reviews/:id/status",
  verifyToken,
  isAdmin,
  adminController.updateReviewStatus,
);
router.post(
  "/reviews/:id/reply",
  verifyToken,
  isAdmin,
  adminController.replyToReview,
);
router.delete(
  "/reviews/:id",
  verifyToken,
  isAdmin,
  adminController.deleteReview,
);
router.get(
  "/revenue-stats",
  verifyToken,
  isAdmin,
  adminController.getRevenueStats,
);
router.patch(
  "/users/:id/status",
  verifyToken,
  isAdmin,
  adminController.updateUserStatus,
);
router.patch(
  "/users/:id/role",
  verifyToken,
  isAdmin,
  adminController.updateUserRole,
);
router.patch(
  "/users/:id/password",
  verifyToken,
  isAdmin,
  adminController.resetUserPassword,
);

// ------- Bảo hành (Admin) -------
// /stats, /status/bulk, /bulk phải đứng TRƯỚC /:id để không bị nuốt làm id
router.get("/warranties/stats", verifyToken, isAdmin, adminWarrantyController.getWarrantyStats);
router.patch("/warranties/status/bulk", verifyToken, isAdmin, adminWarrantyController.bulkSetStatus);
router.delete("/warranties/bulk", verifyToken, isAdmin, adminWarrantyController.bulkDelete);
router.get("/warranties", verifyToken, isAdmin, adminWarrantyController.getAllWarranties);
router.get("/warranties/:id", verifyToken, isAdmin, adminWarrantyController.getWarrantyDetail);
router.patch("/warranties/:id", verifyToken, isAdmin, adminWarrantyController.updateWarranty);
router.delete("/warranties/:id", verifyToken, isAdmin, adminWarrantyController.deleteWarranty);

// Yêu cầu bảo hành của khách
router.get("/warranty-requests", verifyToken, isAdmin, adminWarrantyController.getRequests);
router.patch(
  "/warranty-requests/:id/reply",
  verifyToken,
  isAdmin,
  adminWarrantyController.replyRequest,
);

// ------- Flash Sale (Admin) -------
// /stats, /status/bulk, /bulk đứng TRƯỚC /:id để không bị nuốt làm id
router.get("/flash-sales/stats", verifyToken, isAdmin, adminFlashSaleController.getStats);
router.patch("/flash-sales/status/bulk", verifyToken, isAdmin, adminFlashSaleController.bulkSetStatus);
router.delete("/flash-sales/bulk", verifyToken, isAdmin, adminFlashSaleController.bulkDelete);
router.get("/flash-sales", verifyToken, isAdmin, adminFlashSaleController.getAll);
router.post("/flash-sales", verifyToken, isAdmin, adminFlashSaleController.create);
router.get("/flash-sales/:id", verifyToken, isAdmin, adminFlashSaleController.getDetail);
router.put("/flash-sales/:id", verifyToken, isAdmin, adminFlashSaleController.update);
router.patch("/flash-sales/:id/status", verifyToken, isAdmin, adminFlashSaleController.setStatus);
router.delete("/flash-sales/:id", verifyToken, isAdmin, adminFlashSaleController.delete);

export default router;
