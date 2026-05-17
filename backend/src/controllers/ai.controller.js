import aiService from '../services/ai.service.js';

const chat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Tin nhắn là bắt buộc' });
        }

        const response = await aiService.generateChatResponse(message, history);

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('Lỗi bộ điều khiển AI:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Lỗi máy chủ nội bộ trong quá trình xử lý cuộc trò chuyện AI'
        });
    }
};

export default {
    chat
};