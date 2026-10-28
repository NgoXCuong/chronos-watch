import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = express.Router();

// SePay Webhook - tiếp nhận callback tự động từ SePay (Public endpoint)
router.post('/sepay/webhook', paymentController.handleSePayWebhook);

// API Giả lập thanh toán SePay thành công (Dành cho Test/Demo local)
router.post('/sepay/mock-payment/:orderId', paymentController.mockSePayPayment);

// Lấy thông tin thanh toán VietQR SePay của đơn hàng (Requires login)
router.get('/sepay/info/:orderId', verifyToken, paymentController.getSePayPaymentInfo);

// Cấu hình ngân hàng
router.get('/bank-config', paymentController.getBankConfig);

export default router;
