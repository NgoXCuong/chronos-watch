import express from 'express';
import voucherController from '../controllers/voucher.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/admin.middleware.js';

const router = express.Router();

// Public routes (for testing/checking voucher before checkout)
const optionalAuth = (req, res, next) => req.headers.authorization || req.cookies?.token ? verifyToken(req, res, next) : next();
router.get('/public', optionalAuth, voucherController.getPublic);
router.get('/available', optionalAuth, voucherController.getAvailable);
router.get('/mine', verifyToken, voucherController.getMine);
router.get('/validate', optionalAuth, voucherController.validate);
router.post('/validate', optionalAuth, voucherController.validate);

// Admin only routes
router.get('/', verifyToken, isAdmin, voucherController.getAll);
router.get('/:id', verifyToken, isAdmin, voucherController.getDetail);
router.post('/', verifyToken, isAdmin, voucherController.create);
router.post('/:id/gift', verifyToken, isAdmin, voucherController.gift);
router.put('/:id', verifyToken, isAdmin, voucherController.update);
router.patch('/status/bulk', verifyToken, isAdmin, voucherController.bulkUpdateStatus);
router.patch('/visibility/bulk', verifyToken, isAdmin, voucherController.bulkUpdateVisibility);
router.patch('/:id/status', verifyToken, isAdmin, voucherController.toggleStatus);
// "bulk" phải đăng ký trước "/:id" nếu không bị match thành id
router.delete('/bulk', verifyToken, isAdmin, voucherController.bulkDelete);
router.delete('/:id', verifyToken, isAdmin, voucherController.delete);

export default router;
