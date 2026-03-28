import reviewService from '../services/review.service.js';

const reviewController = {
    create: async (req, res) => {
        try {
            const userId = req.user.id;
            const review = await reviewService.createReview(userId, req.body);
            res.status(201).json({
                message: "Đánh giá sản phẩm thành công!",
                review
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getByProduct: async (req, res) => {
        try {
            const productId = req.params.productId;
            const reviews = await reviewService.getProductReviews(productId);
            const stats = await reviewService.getReviewStats(productId);
            res.json({
                ...stats,
                reviews
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const isAdmin = req.user.role === 'admin';
            const userId = req.user.id;
            await reviewService.deleteReview(req.params.id, userId, isAdmin);
            res.json({ message: "Xóa đánh giá thành công!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default reviewController;
