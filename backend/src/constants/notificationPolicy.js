import { Op } from 'sequelize';

// Chuông admin là danh sách việc cần chú ý, không phải nhật ký mọi hoạt động.
const TITLES = {
    order: ['Đơn hàng mới', 'Đơn hàng bị hủy'],
    warranty: ['Yêu cầu bảo hành mới'],
    review: ['Đánh giá tiêu cực'],
    stock: ['Hết hàng', 'Nguy cơ hết hàng trước khi nhập'],
};

export function isImportantAdminNotification(payload) {
    return Boolean(payload.link?.startsWith('/admin/') && TITLES[payload.type]?.includes(payload.title));
}

export function importantAdminWhere() {
    return {
        link: { [Op.like]: '/admin/%' },
        [Op.or]: Object.entries(TITLES).map(([type, titles]) => ({
            type, title: { [Op.in]: titles },
            // Loại cảnh báo ngưỡng cố định cũ, tránh lặp với dự báo theo nhu cầu.
            ...(type === 'stock' ? { dedupe_key: { [Op.like]: 'inventory-%' } } : {}),
        })),
    };
}
