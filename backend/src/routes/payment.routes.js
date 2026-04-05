import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const router = express.Router();

// VNPay callbacks (Normally these are GET requests from VNPay)
router.get('/vnpay_return', paymentController.handleVNPayReturn);
router.get('/vnpay_ipn', paymentController.handleVNPayIPN);
router.get('/bank-config', paymentController.getBankConfig);

export default router;
