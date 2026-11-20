export const INVENTORY_LEVELS = {
    out_of_stock: { label: 'Hết hàng', badge: 'destructive-soft' },
    critical: { label: 'Cần nhập gấp', badge: 'destructive-soft' },
    reorder: { label: 'Cần nhập', badge: 'warning' },
    healthy: { label: 'Chưa cần nhập', badge: 'success' },
    insufficient: { label: 'Chưa đủ dữ liệu', badge: 'muted' },
    inactive: { label: 'Ngừng bán', badge: 'muted' },
};

export const INVENTORY_FIELDS = [
    { key: 'reorder_lead_days', label: 'Thời gian nhập hàng', min: 1, max: 365, defaultValue: '7', hint: 'Từ khi đặt nhà cung cấp đến khi hàng có thể bán.' },
    { key: 'reorder_safety_days', label: 'Ngày dự phòng', min: 0, max: 365, defaultValue: '7', hint: 'Khoảng đệm cho giao hàng chậm hoặc nhu cầu tăng.' },
    { key: 'demand_window_days', label: 'Kỳ quan sát nhu cầu', min: 14, max: 90, defaultValue: '28', hint: 'Số ngày gần nhất dùng để tính tốc độ mua, gồm cả ngày không bán.' },
];

export const inventoryCoverText = (health) => {
    if (health?.days_of_cover == null) return 'Chưa đủ dữ liệu để ước tính';
    const days = Number(health.days_of_cover);
    if (days > 0 && days < 1) return 'Dự kiến đủ dưới 1 ngày';
    return `Dự kiến đủ ${days.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} ngày`;
};

export const inventoryReasonText = (health) => health?.reason === 'short_history'
    ? 'Cần tối thiểu 14 ngày quan sát từ khi mở bán hoặc có hàng trở lại.'
    : 'Cần tối thiểu 3 chiếc mua hợp lệ trong kỳ quan sát.';
