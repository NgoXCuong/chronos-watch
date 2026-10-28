import { Op } from 'sequelize';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import { LOW_STOCK_THRESHOLD } from '../constants/notifications.js';

/**
 * Số liệu cho badge điều hướng admin (không phải thông báo): đếm THẬT trên bảng,
 * không phụ thuộc vào 20 thông báo mới nhất đang hiển thị.
 * Tách khỏi notification.service để service đó không phải kéo Order/Product vào
 * (unit test của auth chỉ mock User).
 */
const adminBadgeService = {
    getCounts: async () => {
        const [pendingOrders, lowStock] = await Promise.all([
            Order.count({ where: { status: 'pending' } }),
            Product.count({ where: { stock: { [Op.lte]: LOW_STOCK_THRESHOLD } } }),
        ]);
        return { pendingOrders, lowStock };
    },
};

export default adminBadgeService;
