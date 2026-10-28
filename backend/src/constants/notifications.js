// Ngưỡng cảnh báo tồn kho dùng chung cho dashboard + thông báo admin.
export const LOW_STOCK_THRESHOLD = 10;

export const ORDER_STATUS_LABEL = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
    returned: 'Đã hoàn trả',
};

export const WARRANTY_REQUEST_STATUS_LABEL = {
    pending: 'Đã tiếp nhận',
    processing: 'Đang xử lý',
    done: 'Đã xử lý xong',
    rejected: 'Bị từ chối',
};

// Thông báo lưu STRING(500): cắt nội dung dài trước khi ghép vào message.
export const truncateText = (value, max = 120) => {
    const text = String(value ?? '').trim();
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};

export const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
