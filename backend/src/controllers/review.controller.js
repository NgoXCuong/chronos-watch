import reviewService from '../services/review.service.js';
import asyncHandler from "../utils/asyncHandler.js";

const reviewController = {
    create: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const review = await reviewService.createReview(userId, req.body);
        res.status(201).json({
            message: "Đánh giá sản phẩm thành công!",
            review
        });
    }),

    getByProduct: asyncHandler(async (req, res) => {
        const productId = req.params.productId;
        const reviews = await reviewService.getProductReviews(productId);
        const stats = await reviewService.getReviewStats(productId);
        res.json({
            ...stats,
            reviews
        });
    }),

    delete: asyncHandler(async (req, res) => {
        const isAdmin = req.user.role === 'admin';
        const userId = req.user.id;
        await reviewService.deleteReview(req.params.id, userId, isAdmin);
        res.json({ message: "Xóa đánh giá thành công!" });
    })
};

export default reviewController;
