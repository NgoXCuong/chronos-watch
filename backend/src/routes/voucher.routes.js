import express from 'express';
import voucherController from '../controllers/voucher.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/admin.middleware.js';

const router = express.Router();

// Public routes (for testing/checking voucher before checkout)
router.get('/validate', voucherController.validate);

// Admin only routes
router.get('/', verifyToken, isAdmin, voucherController.getAll);
router.get('/:id', verifyToken, isAdmin, voucherController.getDetail);
router.post('/', verifyToken, isAdmin, voucherController.create);
router.put('/:id', verifyToken, isAdmin, voucherController.update);
router.delete('/:id', verifyToken, isAdmin, voucherController.delete);

export default router;
