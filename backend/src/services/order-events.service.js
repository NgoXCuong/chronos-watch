import notificationService from "./notification.service.js";
import { LOW_STOCK_THRESHOLD, ORDER_STATUS_LABEL, formatMoney, truncateText } from "../constants/notifications.js";

/**
 * Thông báo phát sinh từ vòng đời đơn hàng — tách khỏi order.service.js (đã dài)
 * theo Rule 1. Mọi hàm gọi SAU khi transaction commit, và notificationService
 * tự nuốt lỗi nên không thể làm hỏng nghiệp vụ đặt/hủy đơn.
 */

const orderCodeOf = (order) => order.order_code || `#${order.id}`;

export const notifyNewOrder = async (order, user, items) => {
    const code = orderCodeOf(order);
    const customerName = user?.full_name || user?.username || "Khách hàng";

    await notificationService.notifyUser(order.user_id, {
        type: "order",
        title: "Đặt hàng thành công",
        message: `Đơn ${code} đã được tạo và đang chờ xác nhận.`,
        link: `/orders/${order.id}`,
    });

    await notificationService.notifyAdmins({
        type: "order",
        title: "Đơn hàng mới",
        message: `Khách ${customerName} vừa đặt đơn ${code} · ${formatMoney(order.total_amount)}.`,
        link: `/admin/orders/${order.id}`,
    });

    // Cảnh báo tồn kho chỉ bắn khi sản phẩm vừa chạm ngưỡng, dedupe 24h ở service.
    for (const item of items) {
        if (!item.product) continue;
        const left = Math.max(0, Number(item.product.stock || 0) - Number(item.quantity || 0));
        if (left > LOW_STOCK_THRESHOLD) continue;
        await notificationService.notifyAdminsOnce(`stock-${item.product_id}`, {
            type: "stock",
            title: left === 0 ? "Hết hàng" : "Sắp hết hàng",
            message: `Sản phẩm ${item.product.name} chỉ còn ${left} trong kho.`,
            link: "/admin/products",
        });
    }
};

export const notifyOrderStatus = async (order, status, note) => {
    if (!order.user_id) return;
    const code = orderCodeOf(order);
    const label = ORDER_STATUS_LABEL[status] || status;
    const reason = note ? ` — ${truncateText(note, 120)}` : "";

    await notificationService.notifyUser(order.user_id, {
        type: "order",
        title: status === "cancelled" ? "Đơn hàng đã hủy" : "Cập nhật đơn hàng",
        message: `Đơn ${code}: ${label}${reason}.`,
        link: `/orders/${order.id}`,
    });

    if (status === "delivered") {
        await notificationService.notifyUser(order.user_id, {
            type: "warranty",
            title: "Bảo hành đã kích hoạt",
            message: `Phiếu bảo hành cho đơn ${code} đã được tạo. Bạn có thể gửi yêu cầu bảo hành khi cần.`,
            link: `/warranties?order=${order.id}`,
        });
    }
};

export const notifyPaymentConfirmed = async (order) => {
    if (!order.user_id) return;
    await notificationService.notifyUser(order.user_id, {
        type: "payment",
        title: "Đã xác nhận thanh toán",
        message: `Đơn ${orderCodeOf(order)} đã được xác nhận thanh toán.`,
        link: `/orders/${order.id}`,
    });
};

export const notifyCustomerCancelled = async (order, note) => {
    await notificationService.notifyAdmins({
        type: "order",
        title: "Đơn hàng bị hủy",
        message: `Khách ${order.full_name || "hàng"} đã hủy đơn ${orderCodeOf(order)}${note ? ` — ${truncateText(note, 100)}` : ""}.`,
        link: `/admin/orders/${order.id}`,
    });
};

const orderEvents = {
    notifyNewOrder,
    notifyOrderStatus,
    notifyPaymentConfirmed,
    notifyCustomerCancelled,
};

export default orderEvents;
