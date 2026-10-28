import Review from '../models/review.model.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/order_detail.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import sequelize from '../config/db.js';
import { QueryTypes } from 'sequelize';
import { Op } from 'sequelize';
import AppError from "../utils/AppError.js";
import notificationService from "./notification.service.js";
import { truncateText } from "../constants/notifications.js";

// Denormalize điểm TB + số lượng đánh giá vào products (để hiển thị danh sách nhanh)
export const syncProductRating = async (productId) => {
    if (!productId) return;
    const [agg] = await sequelize.query(
        `SELECT ROUND(AVG(rating), 1) AS avg_rating, COUNT(id) AS review_count
         FROM reviews WHERE product_id = :pid AND is_active = 1`,
        { replacements: { pid: productId }, type: QueryTypes.SELECT }
    );
    await Product.update(
        {
            avg_rating: agg && agg.avg_rating != null ? parseFloat(agg.avg_rating) : 0,
            review_count: agg && agg.review_count ? parseInt(agg.review_count, 10) : 0
        },
        { where: { id: productId } }
    );
};

const reviewService = {
    createReview: async (userId, data) => {
        const product_id = data.product_id || data.productId;
        const { rating, comment } = data;

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
            throw new AppError(403, "Tuyệt phẩm này chỉ dành cho những người thực sự sở hữu. Hãy để lại cảm nhận sau khi bạn đã nhận được sản phẩm.");
        }

        // 2. Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa (chỉ cho phép 1 lần đánh giá/sản phẩm)
        const existingReview = await Review.findOne({
            where: {
                user_id: userId,
                product_id: product_id
            }
        });

        if (existingReview) {
            throw new AppError(400, "Dấu ấn của bạn đã được ghi lại. Mỗi tuyệt phẩm chỉ cần một lời cảm nhận chân thành.");
        }

        // 3. Tạo đánh giá mới
        const review = await Review.create({
            user_id: userId,
            product_id,
            rating,
            comment
        });

        // 4. Cập nhật lại điểm tổng hợp trên sản phẩm
        await syncProductRating(product_id);

        const [reviewer, product] = await Promise.all([
            User.findByPk(userId, { attributes: ['username', 'full_name'] }),
            Product.findByPk(product_id, { attributes: ['name'] })
        ]);
        await notificationService.notifyAdmins({
            type: 'review',
            title: Number(rating) <= 2 ? 'Đánh giá tiêu cực' : 'Đánh giá mới',
            message: `${reviewer?.full_name || reviewer?.username || 'Khách'} đánh giá ${rating}★ cho ${product?.name || 'sản phẩm'}${comment ? ` — ${truncateText(comment, 100)}` : ''}.`,
            link: '/admin/reviews'
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

    // Khối "Đánh giá từ người dùng" trang chủ: review đã kiểm duyệt, ≥4 sao, có lời bình.
    getFeaturedReviews: async (limit) => {
        const take = Math.min(8, Math.max(1, parseInt(limit, 10) || 3));
        return await Review.findAll({
            where: {
                is_active: true,
                rating: { [Op.gte]: 4 },
                comment: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
            },
            include: [
                { model: User, as: 'user', attributes: ['username', 'full_name', 'avatar_url'] },
                { model: Product, as: 'product', attributes: ['id', 'name', 'slug', 'image_url'] }
            ],
            order: [['created_at', 'DESC']],
            limit: take
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
            throw new AppError(404, "Đánh giá không tồn tại.");
        }

        if (!isAdmin && review.user_id !== userId) {
            throw new AppError(403, "Bạn không có quyền xóa đánh giá này.");
        }

        await review.destroy();
        await syncProductRating(review.product_id);
        return true;
    }
};

export default reviewService;
