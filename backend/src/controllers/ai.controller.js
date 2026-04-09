import aiService from '../services/ai.service.js';

const chat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await aiService.generateChatResponse(message, history);

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('AI Controller Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error while processing AI chat'
        });
    }
};

export default {
    chat
};
