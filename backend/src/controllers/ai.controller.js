import aiService from '../services/ai.service.js';
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { validateChatRecommendation } from '../services/chat-products.service.js';

const chat = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        throw new AppError(400, 'Tin nhắn là bắt buộc');
    }

    const response = await aiService.generateChatResponse(message, history);
    const checked = await validateChatRecommendation(response);

    res.status(200).json({
        success: true,
        data: checked.content,
        products: checked.products,
    });
});

export default {
    chat
};
