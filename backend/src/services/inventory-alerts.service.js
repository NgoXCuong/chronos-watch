import notificationService from './notification.service.js';
import { getInventoryRows } from './inventory-planning.service.js';

export function inventoryNotification(product) {
    const h = product.inventory_health;
    const title = { out_of_stock: 'Hết hàng', critical: 'Nguy cơ hết hàng trước khi nhập', reorder: 'Cần lên kế hoạch nhập hàng' }[h.level];
    return {
        type: 'stock', title,
        message: h.level === 'out_of_stock'
            ? `${product.name} đã hết hàng có thể bán.`
            : `${product.name}: còn ${product.stock} chiếc, dự kiến đủ ${h.days_of_cover} ngày; nhập hàng ${h.lead_days} ngày + dự phòng ${h.safety_days} ngày.`,
        link: `/admin/products/edit/${product.id}`,
    };
}

// Tác vụ phụ: lỗi thông báo không làm hỏng đơn hàng hay lưu sản phẩm.
export async function notifyInventoryAlerts(ids) {
    try {
        const products = await getInventoryRows({ ids });
        for (const product of products) {
            if (!['critical', 'out_of_stock'].includes(product.inventory_health.level)) continue;
            await notificationService.notifyAdminsOnce(`inventory-${product.id}-${product.inventory_health.level}`, inventoryNotification(product));
        }
    } catch (error) {
        console.error('[inventory-alerts]', error.message);
    }
}

// Đánh giá lại mỗi giờ kể cả khi không có đơn mới; khóa nhẹ chống chạy chồng.
export function startInventoryMonitor() {
    let running = false;
    const run = async () => {
        if (running) return;
        running = true;
        try { await notifyInventoryAlerts(); } finally { running = false; }
    };
    const initial = setTimeout(run, 60000);
    const timer = setInterval(run, 3600000);
    initial.unref();
    timer.unref();
    return () => { clearTimeout(initial); clearInterval(timer); };
}
