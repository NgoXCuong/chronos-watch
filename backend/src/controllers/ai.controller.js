import aiService from '../services/ai.service.js';
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const chat = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        throw new AppError(400, 'Tin nhắn là bắt buộc');
    }

    const response = await aiService.generateChatResponse(message, history);

    res.status(200).json({
        success: true,
        data: response
    });
});

export default {
    chat
};
