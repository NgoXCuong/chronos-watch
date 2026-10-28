import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { Op, fn, col } from "sequelize";
import AppError from "../utils/AppError.js";
import { syncProductRating } from "./review.service.js";

// Cột được phép sort từ bảng admin (whitelist chống SQL injection qua ORDER BY)
const SORTABLE_REVIEW_COLUMNS = ["created_at", "rating", "updated_at"];

const buildReviewSort = (sort, dir) => {
    const key = SORTABLE_REVIEW_COLUMNS.includes(sort) ? sort : "created_at";
    const direction = String(dir).toLowerCase() === "asc" ? "ASC" : "DESC";
    return [[key, direction], ["id", "ASC"]];
};

const UNREPLIED = { [Op.or]: [{ admin_reply: { [Op.is]: null } }, { admin_reply: { [Op.eq]: "" } }] };
const REPLIED = { admin_reply: { [Op.not]: null, [Op.ne]: "" } };

const buildReviewWhere = (query = {}) => {
    const where = {};
    const { search, is_active, rating, replied } = query;

    if (search) {
        const like = { [Op.like]: `%${search}%` };
        where[Op.or] = [
            { comment: like },
            { "$user.username$": like },
            { "$user.email$": like },
            { "$product.name$": like }
        ];
    }

    if (is_active === "true" || is_active === "false") {
        where.is_active = is_active === "true";
    }

    const stars = parseInt(rating, 10);
    if (stars >= 1 && stars <= 5) where.rating = stars;

    // Op.and để không ghi đè Op.or của ô tìm kiếm
    if (replied === "unreplied") where[Op.and] = [UNREPLIED];
    if (replied === "replied") where[Op.and] = [REPLIED];

    return where;
};

const adminReviewService = {
    getAllReviews: async (query = {}) => {
        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = (page - 1) * limit;

        return await Review.findAndCountAll({
            where: buildReviewWhere(query),
            include: [
                { model: User, as: "user", attributes: ["username", "email"] },
                { model: Product, as: "product", attributes: ["id", "name", "image_url"] }
            ],
            order: buildReviewSort(query.sort, query.dir),
            limit,
            offset
        });
    },

    // Num thống kê cho thanh trên đầu trang (tính trên toàn bảng, không phụ thuộc filter)
    getReviewStats: async () => {
        const [total, activeCount, unrepliedCount, byRating] = await Promise.all([
            Review.count(),
            Review.count({ where: { is_active: true } }),
            Review.count({ where: UNREPLIED }),
            Review.findAll({
                attributes: ["rating", [fn("COUNT", col("review.id")), "count"]],
                group: ["rating"],
                raw: true
            })
        ]);

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let sum = 0;
        byRating.forEach((row) => {
            const count = parseInt(row.count, 10) || 0;
            if (distribution[row.rating] !== undefined) distribution[row.rating] = count;
            sum += row.rating * count;
        });

        return {
            total,
            active_count: activeCount,
            hidden_count: total - activeCount,
            unreplied_count: unrepliedCount,
            avg_rating: total ? Math.round((sum / total) * 10) / 10 : 0,
            distribution
        };
    },

    updateReviewStatus: async (reviewId, is_active) => {
        const review = await Review.findByPk(reviewId);
        if (!review) throw new AppError(404, "Đánh giá không tồn tại");
        review.is_active = is_active;
        await review.save();
        await syncProductRating(review.product_id);
        return review;
    },

    replyToReview: async (reviewId, reply) => {
        const message = String(reply ?? "").trim();
        if (!message) throw new AppError(400, "Nội dung phản hồi không được để trống");
        const review = await Review.findByPk(reviewId);
        if (!review) throw new AppError(404, "Đánh giá không tồn tại");
        review.admin_reply = message;
        review.replied_at = new Date();
        await review.save();
        return review;
    },

    deleteReview: async (reviewId) => {
        const review = await Review.findByPk(reviewId);
        if (!review) throw new AppError(404, "Đánh giá không tồn tại");
        await review.destroy();
        await syncProductRating(review.product_id);
        return review;
    }
};

export default adminReviewService;
