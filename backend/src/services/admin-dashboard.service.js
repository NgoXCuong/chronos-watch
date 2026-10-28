import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import OrderDetail from "../models/order_detail.model.js";
import Voucher from "../models/voucher.model.js";
import { Op, fn, col, QueryTypes } from "sequelize";
import sequelize from "../config/db.js";

// Doanh thu theo ngành hàng / thương hiệu (toàn thời gian, loại đơn hủy & hoàn)
const REVENUE_BY_CATEGORY_SQL = `
    SELECT c.name AS name,
           COALESCE(SUM(od.quantity * od.price), 0) AS revenue,
           COALESCE(SUM(od.quantity), 0) AS units
    FROM order_details od
             JOIN orders o ON o.id = od.order_id
             JOIN products p ON p.id = od.product_id
             JOIN product_categories pc ON pc.product_id = p.id
             JOIN categories c ON c.id = pc.category_id
    WHERE o.status NOT IN ('cancelled', 'returned')
    GROUP BY c.id, c.name
    ORDER BY revenue DESC
    LIMIT 6`;

const REVENUE_BY_BRAND_SQL = `
    SELECT b.name AS name,
           COALESCE(SUM(od.quantity * od.price), 0) AS revenue,
           COALESCE(SUM(od.quantity), 0) AS units
    FROM order_details od
             JOIN orders o ON o.id = od.order_id
             JOIN products p ON p.id = od.product_id
             JOIN brands b ON b.id = p.brand_id
    WHERE o.status NOT IN ('cancelled', 'returned')
    GROUP BY b.id, b.name
    ORDER BY revenue DESC
    LIMIT 6`;

const EXCLUDED_STATUSES = ['cancelled', 'returned'];

const dashboardService = {
    getDashboardStats: async () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        // 1. Doanh thu & chỉ số cơ bản (tháng này / tháng trước)
        const results = await Promise.all([
            Order.sum('total_amount', {
                where: { created_at: { [Op.gte]: startOfMonth }, status: { [Op.notIn]: EXCLUDED_STATUSES } }
            }),
            Order.sum('total_amount', {
                where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] }, status: { [Op.notIn]: EXCLUDED_STATUSES } }
            }),
            User.count({ where: { role: 'customer' } }),
            User.count({ where: { role: 'customer', created_at: { [Op.lt]: startOfMonth } } }),
            User.count({ where: { role: 'customer', created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } } }),
            Order.count({ where: { status: { [Op.notIn]: EXCLUDED_STATUSES } } }),
            Order.count({ where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] }, status: { [Op.notIn]: EXCLUDED_STATUSES } } }),
            Product.count(),
            Voucher.count(),
            Voucher.count({ where: { created_at: { [Op.lt]: startOfMonth } } }),
            Voucher.count({ where: { created_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } } }),
            Order.count({ where: { created_at: { [Op.gte]: startOfMonth }, status: { [Op.notIn]: EXCLUDED_STATUSES } } })
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
        const thisMonthOrders = results[11];

        const usersThisMonth = totalUsersCount - usersBeforeThisMonth;
        const vouchersThisMonth = totalVouchersCount - vouchersBeforeThisMonth;
        const aov = thisMonthOrders > 0 ? monthlyRevenue / thisMonthOrders : 0;
        const lastMonthAov = lastMonthOrders > 0 ? lastMonthRevenue / lastMonthOrders : 0;

        // 2. Các nguồn dữ liệu còn lại của dashboard
        const [
            orderStatusStats,
            revenueHistory,
            topProducts,
            lowStockProducts,
            lowStockCount,
            recentOrders,
            pendingOrders,
            ordersToday,
            outOfStockCount,
            inventory,
            userGrowthHistory,
            reviewDistribution,
            revenueByCategory,
            revenueByBrand
        ] = await Promise.all([
            Order.count({ group: ['status'] }),
            Order.findAll({
                attributes: [
                    [fn('MONTH', col('created_at')), 'month'],
                    [fn('YEAR', col('created_at')), 'year'],
                    [fn('SUM', col('total_amount')), 'revenue'],
                    [fn('COUNT', col('id')), 'orders']
                ],
                where: { created_at: { [Op.gte]: sixMonthsAgo }, status: { [Op.notIn]: EXCLUDED_STATUSES } },
                group: [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))],
                order: [[fn('YEAR', col('created_at')), 'ASC'], [fn('MONTH', col('created_at')), 'ASC']],
                raw: true
            }),
            Product.findAll({
                where: { status: 'active' },
                order: [['sold_count', 'DESC']],
                limit: 5,
                attributes: ['id', 'name', 'image_url', 'sold_count', 'stock', 'price']
            }),
            Product.findAll({
                where: { stock: { [Op.lte]: 10 } },
                order: [['stock', 'ASC']],
                limit: 5,
                attributes: ['id', 'name', 'stock', 'image_url']
            }),
            Product.count({ where: { stock: { [Op.lte]: 10 } } }),
            Order.findAll({
                limit: 6,
                order: [['created_at', 'DESC']],
                include: [
                    { model: User, as: 'user', attributes: ['username', 'full_name'] },
                    {
                        model: OrderDetail,
                        as: 'details',
                        include: [{ model: Product, as: 'product', attributes: ['name', 'image_url'] }]
                    }
                ]
            }),
            Order.count({ where: { status: 'pending' } }),
            Order.count({ where: { created_at: { [Op.gte]: startOfToday }, status: { [Op.notIn]: EXCLUDED_STATUSES } } }),
            Product.count({ where: { stock: 0 } }),
            Product.findAll({
                attributes: [
                    [fn('COUNT', col('id')), 'sku_count'],
                    [fn('SUM', col('stock')), 'stock_units'],
                    [fn('SUM', sequelize.literal('stock * price')), 'stock_value']
                ],
                raw: true
            }).then((rows) => rows[0] || {}),
            User.findAll({
                attributes: [
                    [fn('YEAR', col('created_at')), 'year'],
                    [fn('MONTH', col('created_at')), 'month'],
                    [fn('COUNT', col('id')), 'count']
                ],
                where: { role: 'customer', created_at: { [Op.gte]: sixMonthsAgo } },
                group: [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))],
                order: [[fn('YEAR', col('created_at')), 'ASC'], [fn('MONTH', col('created_at')), 'ASC']],
                raw: true
            }),
            Review.findAll({
                attributes: ['rating', [fn('COUNT', col('id')), 'count']],
                where: { is_active: true },
                group: ['rating'],
                raw: true
            }),
            sequelize.query(REVENUE_BY_CATEGORY_SQL, { type: QueryTypes.SELECT }),
            sequelize.query(REVENUE_BY_BRAND_SQL, { type: QueryTypes.SELECT })
        ]);

        return {
            monthly_revenue: monthlyRevenue,
            last_month_revenue: lastMonthRevenue,
            total_users: totalUsersCount,
            last_month_users: usersBeforeThisMonth,
            users_last_month: usersCreatedLastMonth,
            users_this_month: usersThisMonth,
            total_orders: totalOrdersCount,
            last_month_orders: lastMonthOrders,
            orders_this_month: thisMonthOrders,
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
            recent_orders: recentOrders,
            pending_orders: pendingOrders,
            orders_today: ordersToday,
            out_of_stock_count: outOfStockCount,
            stock_units: parseInt(inventory.stock_units || 0, 10),
            stock_value: parseFloat(inventory.stock_value || 0),
            user_growth_history: userGrowthHistory,
            review_distribution: reviewDistribution,
            revenue_by_category: revenueByCategory,
            revenue_by_brand: revenueByBrand
        };
    },

    getRevenueStats: async (startDate, endDate) => {
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
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
                status: { [Op.notIn]: EXCLUDED_STATUSES }
            },
            group,
            order,
            raw: true
        });

        return { revenue_history: revenueHistory, start_date: start, end_date: end, is_daily: isDaily };
    }
};

export default dashboardService;
