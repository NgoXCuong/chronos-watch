import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { Op, fn, col } from "sequelize";

const adminService = {
    getDashboardStats: async () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Doanh thu trong tháng (Chỉ tính các đơn không bị hủy)
        const monthlyRevenueParams = await Order.findAll({
            attributes: [
                [fn('SUM', col('total_amount')), 'total_revenue']
            ],
            where: {
                created_at: { [Op.gte]: startOfMonth },
                status: { [Op.notIn]: ['cancelled', 'returned'] }
            },
            raw: true
        });
        const monthlyRevenue = monthlyRevenueParams[0].total_revenue || 0;

        // 2. Tổng số khách hàng
        const totalUsers = await User.count({
            where: { role: 'customer' }
        });

        // 3. Tổng số lượng đơn hàng (Không tính hủy)
        const totalOrders = await Order.count({
            where: {
                status: { [Op.notIn]: ['cancelled', 'returned'] }
            }
        });

        // 4. Top 5 sản phẩm bán chạy nhất
        const topProducts = await Product.findAll({
            where: { status: 'active' },
            order: [['sold_count', 'DESC']],
            limit: 5,
            attributes: ['id', 'name', 'slug', 'image_url', 'price', 'sold_count', 'stock']
        });

        return {
            monthly_revenue: parseFloat(monthlyRevenue),
            total_users: totalUsers,
            total_orders: totalOrders,
            top_selling_products: topProducts
        };
    }
};

export default adminService;
