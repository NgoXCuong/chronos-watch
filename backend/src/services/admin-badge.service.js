import Order from '../models/order.model.js';
import { getInventorySummary } from './inventory-planning.service.js';

/**
 * Số liệu cho badge điều hướng admin (không phải thông báo): đếm THẬT trên bảng,
 * không phụ thuộc vào 20 thông báo mới nhất đang hiển thị.
 * Tách khỏi notification.service để service đó không phải kéo Order/Product vào
 * (unit test của auth chỉ mock User).
 */
const adminBadgeService = {
    getCounts: async () => {
        const [pendingOrders, inventory] = await Promise.all([
            Order.count({ where: { status: 'pending' } }),
            getInventorySummary(),
        ]);
        return { pendingOrders, lowStock: inventory.alerts.length };
    },
};

export default adminBadgeService;
