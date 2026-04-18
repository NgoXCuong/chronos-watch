import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import OrderDetail from "../models/order_detail.model.js";
import OrderHistory from "../models/order_history.model.js";
import Voucher from "../models/voucher.model.js";
import { Op, fn, col } from "sequelize";

const adminService = {
    getDashboardStats: async () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // 1. Doanh thu & Chỉ số cơ bản (tháng này và tháng trước)
        const results = await Promise.all([
            Order.sum('total_amount', {
                where: { created_at: { [Op.gte]: startOfMonth }, status: { [Op.notIn]: ['cancelled', 'returned'] } }
            }),
            Order.sum('total_amount', {
                where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] }, status: { [Op.notIn]: ['cancelled', 'returned'] } }
            }),
            User.count({ where: { role: 'customer' } }),
            User.count({ where: { role: 'customer', created_at: { [Op.lt]: startOfMonth } } }),
            User.count({ where: { role: 'customer', created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } } }),
            Order.count({ where: { status: { [Op.notIn]: ['cancelled', 'returned'] } } }),
            Order.count({ where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] }, status: { [Op.notIn]: ['cancelled', 'returned'] } } }),
            Product.count(),
            Voucher.count(),
            Voucher.count({ where: { created_at: { [Op.lt]: startOfMonth } } }),
            Voucher.count({ where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } } })
        ]);

        const monthlyRevenue = parseFloat(results[0] || 0);
        const lastMonthRevenue = parseFloat(results[1] || 0);

        const totalUsersCount = results[2];
        const usersBeforeThisMonth = results[3];
        const usersCreatedLastMonth = results[4];
        const totalOrdersCount = results[5];
        const lastMonthOrders = results[6];
        const totalProductsCount = results[7];
        const totalVouchersCount = results[8];
        const vouchersBeforeThisMonth = results[9];
        const vouchersCreatedLastMonth = results[10];

        // Monthly Growth Calculations
        const usersThisMonth = totalUsersCount - usersBeforeThisMonth;
        const vouchersThisMonth = totalVouchersCount - vouchersBeforeThisMonth;

        // Tính AOV tháng này và tháng trước
        const thisMonthOrders = await Order.count({ where: { created_at: { [Op.gte]: startOfMonth }, status: { [Op.notIn]: ['cancelled', 'returned'] } } });
        const aov = thisMonthOrders > 0 ? (monthlyRevenue / thisMonthOrders) : 0;
        const lastMonthAov = lastMonthOrders > 0 ? (lastMonthRevenue / lastMonthOrders) : 0;

        // 2. Thống kê trạng thái đơn hàng (Pie Chart)
        const orderStatusStats = await Order.count({
            group: ['status']
        });

        // 3. Lịch sử doanh thu 6 tháng
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const revenueHistory = await Order.findAll({
            attributes: [
                [fn('MONTH', col('created_at')), 'month'],
                [fn('YEAR', col('created_at')), 'year'],
                [fn('SUM', col('total_amount')), 'revenue'],
                [fn('COUNT', col('id')), 'orders']
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
        const [topProducts, lowStockProducts, lowStockCount] = await Promise.all([
            Product.findAll({
                where: { status: 'active' },
                order: [['sold_count', 'DESC']],
                limit: 3,
                attributes: ['id', 'name', 'image_url', 'sold_count', 'stock']
            }),
            Product.findAll({
                where: { stock: { [Op.lte]: 10 } },
                limit: 3,
                attributes: ['id', 'name', 'stock', 'image_url']
            }),
            Product.count({
                where: { stock: { [Op.lte]: 10 } }
            })
        ]);

        // 5. Đơn hàng gần đây nhất
        const recentOrders = await Order.findAll({
            limit: 3,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, as: 'user', attributes: ['username', 'full_name'] },
                {
                    model: OrderDetail,
                    as: 'details',
                    include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }]
                }
            ]
        });

        return {
            monthly_revenue: monthlyRevenue,
            last_month_revenue: lastMonthRevenue,
            total_users: totalUsersCount,
            last_month_users: usersBeforeThisMonth,
            users_last_month: usersCreatedLastMonth,
            users_this_month: usersThisMonth,
            total_orders: totalOrdersCount,
            last_month_orders: lastMonthOrders,
            total_products: totalProductsCount,
            total_vouchers: totalVouchersCount,
            last_month_vouchers: vouchersBeforeThisMonth,
            vouchers_last_month: vouchersCreatedLastMonth,
            vouchers_this_month: vouchersThisMonth,
            aov: parseFloat(aov.toFixed(0)),
            last_month_aov: parseFloat(lastMonthAov.toFixed(0)),
            order_status_distribution: orderStatusStats,
            revenue_history: revenueHistory,
            top_selling_products: topProducts,
            low_stock_products: lowStockProducts,
            low_stock_count: lowStockCount,
            recent_orders: recentOrders
        };
    },

    getAllUsers: async (query = {}) => {
        const { search } = query;
        const where = {};
        if (search) {
            where[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { full_name: { [Op.like]: `%${search}%` } }
            ];
        }

        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        return await User.findAndCountAll({
            where,
            attributes: ['id', 'username', 'email', 'full_name', 'avatar_url', 'role', 'status', 'created_at'],
            order: [['created_at', 'DESC']],
            limit,
            offset
        });
    },

    getAllOrders: async (query = {}) => {
        const { search, status } = query;
        const where = {};
        if (search) {
            where.id = { [Op.like]: `%${search}%` };
        }
        if (status) {
            where.status = status;
        }

        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        return await Order.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username', 'email']
                }
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset
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
        end.setHours(23, 59, 59, 999);

        // Calculate diff in days
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isDaily = diffDays <= 31;

        const attributes = [
            [fn('YEAR', col('created_at')), 'year'],
            [fn('MONTH', col('created_at')), 'month'],
            [fn('SUM', col('total_amount')), 'revenue'],
            [fn('COUNT', col('id')), 'orders']
        ];
        const group = [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))];
        const order = [[fn('YEAR', col('created_at')), 'ASC'], [fn('MONTH', col('created_at')), 'ASC']];

        if (isDaily) {
            attributes.push([fn('DAY', col('created_at')), 'day']);
            group.push(fn('DAY', col('created_at')));
            order.push([fn('DAY', col('created_at')), 'ASC']);
        }

        const revenueHistory = await Order.findAll({
            attributes,
            where: {
                created_at: { [Op.between]: [start, end] },
                status: { [Op.notIn]: ['cancelled', 'returned'] }
            },
            group,
            order,
            raw: true
        });

        return { revenue_history: revenueHistory, start_date: start, end_date: end, is_daily: isDaily };
    },

    updateUserStatus: async (userId, status) => {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Thành viên không tồn tại');
        user.status = status;
        await user.save();
        return user;
    },

    updateUserRole: async (userId, role) => {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Thành viên không tồn tại');
        user.role = role;
        await user.save();
        return user;
    }
};

export default adminService;
