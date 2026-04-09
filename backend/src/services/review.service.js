import Review from '../models/review.model.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/order_detail.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import { Op } from 'sequelize';

const reviewService = {
    createReview: async (userId, data) => {
        const { product_id, rating, comment } = data;

        // 1. Kiểm tra xem người dùng đã mua sản phẩm này và đơn hàng đã giao thành công chưa
        const hasBought = await Order.findOne({
            where: {
                user_id: userId,
                status: 'delivered'
            },
            include: [{
                model: OrderDetail,
                as: 'details',
                where: { product_id: product_id }
            }]
        });

        if (!hasBought) {
            throw new Error("Tuyệt phẩm này chỉ dành cho những người thực sự sở hữu. Hãy để lại cảm nhận sau khi bạn đã nhận được sản phẩm.");
        }

        // 2. Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa (chỉ cho phép 1 lần đánh giá/sản phẩm)
        const existingReview = await Review.findOne({
            where: {
                user_id: userId,
                product_id: product_id
            }
        });

        if (existingReview) {
            throw new Error("Dấu ấn của bạn đã được ghi lại. Mỗi tuyệt phẩm chỉ cần một lời cảm nhận chân thành.");
        }

        // 3. Tạo đánh giá mới
        const review = await Review.create({
            user_id: userId,
            product_id,
            rating,
            comment
        });

        return review;
    },

    getProductReviews: async (productId) => {
        return await Review.findAll({
            where: { product_id: productId, is_active: true },
            include: [
                { 
                    model: User, 
                    as: 'user', 
                    attributes: ['username', 'full_name', 'avatar_url'] 
                }
            ],
            order: [['created_at', 'DESC']]
        });
    },

    getReviewStats: async (productId) => {
        const reviews = await Review.findAll({
            where: { product_id: productId, is_active: true },
            attributes: ['rating']
        });

        if (reviews.length === 0) {
            return {
                average_rating: 0,
                review_count: 0
            };
        }

        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        return {
            average_rating: parseFloat((total / reviews.length).toFixed(1)),
            review_count: reviews.length
        };
    },

    deleteReview: async (reviewId, userId, isAdmin = false) => {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            throw new Error("Đánh giá không tồn tại.");
        }

        if (!isAdmin && review.user_id !== userId) {
            throw new Error("Bạn không có quyền xóa đánh giá này.");
        }

        await review.destroy();
        return true;
    }
};

export default reviewService;
