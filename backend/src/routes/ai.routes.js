import express from 'express';
import rateLimit from 'express-rate-limit';
import aiController from '../controllers/ai.controller.js';

const router = express.Router();

// Giới hạn 10 tin nhắn/phút cho mỗi IP để tránh spam và vượt hạn ngạch Gemini API
const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Bạn gửi tin nhắn quá nhanh. Vui lòng chờ 1 phút trước khi tiếp tục." },
});

router.post('/chat', aiLimiter, aiController.chat);

export default router;
