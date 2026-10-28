import express from 'express';
import flashSaleController from '../controllers/flash-sale.controller.js';

const router = express.Router();

// Route cố định đứng TRƯỚC /:id để "current" không bị bắt làm id sản phẩm
router.get('/current', flashSaleController.getCurrent);
router.get('/:id', flashSaleController.getProductFlash);

export default router;
