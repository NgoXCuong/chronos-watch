import express from 'express';
import warrantyController from '../controllers/warranty.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = express.Router();

// Khách hàng chỉ làm việc với phiếu của chính mình — service khóa theo req.user.id
router.get('/', verifyToken, warrantyController.getMyWarranties);
router.get('/:id', verifyToken, warrantyController.getMyWarranty);
router.post('/:id/request', verifyToken, warrantyController.createRequest);

export default router;
