import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import { Op, fn, col } from "sequelize";

const adminService = {
    getDashboardStats: async () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // 1. Doanh thu & Chỉ số cơ bản (tháng này và tháng trước)
        const [revenueResult, lastMonthRevResult, totalUsers, lastMonthUsers, totalOrders, lastMonthOrders, totalProducts] = await Promise.all([
            Order.findAll({
                attributes: [[fn('SUM', col('total_amount')), 'total_revenue']],
                where: { created_at: { [Op.gte]: startOfMonth }, status: { [Op.notIn]: ['cancelled', 'returned'] } },
                raw: true
            }),
            Order.findAll({
                attributes: [[fn('SUM', col('total_amount')), 'total_revenue']],
                where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] }, status: { [Op.notIn]: ['cancelled', 'returned'] } },
                raw: true
            }),
            User.count({ where: { role: 'customer' } }),
            User.count({ where: { role: 'customer', created_at: { [Op.lt]: startOfMonth } } }),
            Order.count({ where: { status: { [Op.notIn]: ['cancelled', 'returned'] } } }),
            Order.count({ where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] }, status: { [Op.notIn]: ['cancelled', 'returned'] } } }),
            Product.count()
        ]);

        const monthlyRevenue = parseFloat(revenueResult[0].total_revenue || 0);
        const lastMonthRevenue = parseFloat(lastMonthRevResult[0].total_revenue || 0);

        // Tính AOV tháng này và tháng trước
        const thisMonthOrders = await Order.count({ where: { created_at: { [Op.gte]: startOfMonth }, status: { [Op.notIn]: ['cancelled', 'returned'] } } });
        const aov = thisMonthOrders > 0 ? (monthlyRevenue / thisMonthOrders) : 0;
        const lastMonthAov = lastMonthOrders > 0 ? (lastMonthRevenue / lastMonthOrders) : 0;

        // 2. Thống kê trạng thái đơn hàng (Pie Chart)
        const orderStatusStats = await Order.findAll({
            attributes: ['status', [fn('COUNT', col('id')), 'count']],
            group: ['status'],
            raw: true
        });

        // 3. Lịch sử doanh thu 6 tháng
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const revenueHistory = await Order.findAll({
            attributes: [
                [fn('MONTH', col('created_at')), 'month'],
                [fn('YEAR', col('created_at')), 'year'],
                [fn('SUM', col('total_amount')), 'revenue']
            ],
            where: {
                created_at: { [Op.gte]: sixMonthsAgo },
                status: { [Op.notIn]: ['cancelled', 'returned'] }
            },
            group: [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))],
            order: [[fn('YEAR', col('created_at')), 'ASC'], [fn('MONTH', col('created_at')), 'ASC']],
            raw: true
        });

        // 4. Sản phẩm bán chạy & Sắp hết hàng
        const [topProducts, lowStockProducts] = await Promise.all([
            Product.findAll({
                where: { status: 'active' },
                order: [['sold_count', 'DESC']],
                limit: 5,
                attributes: ['id', 'name', 'image_url', 'sold_count', 'stock']
            }),
            Product.findAll({
                where: { stock: { [Op.lte]: 10 } },
                limit: 5,
                attributes: ['id', 'name', 'stock', 'image_url']
            })
        ]);

        // 5. Đơn hàng gần đây nhất
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [{ model: User, as: 'user', attributes: ['username'] }]
        });

        return {
            monthly_revenue: monthlyRevenue,
            last_month_revenue: lastMonthRevenue,
            total_users: totalUsers,
            last_month_users: lastMonthUsers,
            total_orders: totalOrders,
            last_month_orders: lastMonthOrders,
            total_products: totalProducts,
            aov: parseFloat(aov.toFixed(0)),
            last_month_aov: parseFloat(lastMonthAov.toFixed(0)),
            order_status_distribution: orderStatusStats,
            revenue_history: revenueHistory,
            top_selling_products: topProducts,
            low_stock_products: lowStockProducts,
            recent_orders: recentOrders
        };
    },

    getAllUsers: async () => {
        return await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'status', 'created_at'],
            order: [['created_at', 'DESC']]
        });
    },

    getAllOrders: async () => {
        return await Order.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });
    },

    getOrderDetail: async (orderId) => {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email']
                },
                { 
                    model: OrderDetail, 
                    as: 'details',
                    include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }]
                },
                { model: OrderHistory, as: 'history' }
            ]
        });
        if (!order) throw new Error('Đơn hàng không tồn tại');
        return order;
    },

    getNotifications: async () => {
        const [newOrders, lowStock] = await Promise.all([
            Order.findAll({
                where: { status: 'pending' },
                limit: 5,
                order: [['created_at', 'DESC']],
                include: [{ model: User, as: 'user', attributes: ['username'] }]
            }),
            Product.findAll({
                where: { stock: { [Op.lte]: 10 } },
                limit: 5,
                attributes: ['id', 'name', 'stock']
            })
        ]);

        const notifications = [
            ...newOrders.map(o => ({
                id: `order-${o.id}`,
                type: 'order',
                title: 'Đơn hàng mới',
                message: `Khách hàng ${o.user?.username || 'vãng lai'} vừa đặt đơn #${o.id}`,
                time: o.created_at,
                link: `/admin/orders/${o.id}`
            })),
            ...lowStock.map(p => ({
                id: `stock-${p.id}`,
                type: 'stock',
                title: 'Sắp hết hàng',
                message: `Sản phẩm ${p.name} chỉ còn ${p.stock} trong kho`,
                time: new Date(),
                link: '/admin/products'
            }))
        ];

        // Sắp xếp theo thời gian mới nhất
        return notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
    },

    getAllReviews: async () => {
        return await Review.findAll({
            include: [
                { model: User, as: 'user', attributes: ['username', 'email'] },
                { model: Product, as: 'product', attributes: ['name', 'image_url'] }
            ],
            order: [['created_at', 'DESC']]
        });
    },

    updateReviewStatus: async (reviewId, is_active) => {
        const review = await Review.findByPk(reviewId);
        if (!review) throw new Error('Đánh giá không tồn tại');
        review.is_active = is_active;
        await review.save();
        return review;
    },

    replyToReview: async (reviewId, reply) => {
        const review = await Review.findByPk(reviewId);
        if (!review) throw new Error('Đánh giá không tồn tại');
        review.admin_reply = reply;
        review.replied_at = new Date();
        await review.save();
        return review;
    },

    getRevenueStats: async (startDate, endDate) => {
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
        const end = endDate ? new Date(endDate) : new Date();
        // Set end of day for end date
        end.setHours(23, 59, 59, 999);

        const revenueHistory = await Order.findAll({
            attributes: [
                [fn('MONTH', col('created_at')), 'month'],
                [fn('YEAR', col('created_at')), 'year'],
                [fn('SUM', col('total_amount')), 'revenue'],
                [fn('COUNT', col('id')), 'orders']
            ],
            where: {
                created_at: { [Op.between]: [start, end] },
                status: { [Op.notIn]: ['cancelled', 'returned'] }
            },
            group: [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))],
            order: [[fn('YEAR', col('created_at')), 'ASC'], [fn('MONTH', col('created_at')), 'ASC']],
            raw: true
        });

        return { revenue_history: revenueHistory, start_date: start, end_date: end };
    }
};

export default adminService;
