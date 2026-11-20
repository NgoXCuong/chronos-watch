export const INVENTORY_DEFAULTS = { reorder_lead_days: 7, reorder_safety_days: 7, demand_window_days: 28 };
export const INVENTORY_LIMITS = {
    reorder_lead_days: { min: 1, max: 365, label: 'Thời gian nhập hàng' },
    reorder_safety_days: { min: 0, max: 365, label: 'Số ngày dự phòng' },
    demand_window_days: { min: 14, max: 90, label: 'Kỳ quan sát nhu cầu' },
};
export const INVENTORY_MIN_HISTORY_DAYS = 14;
export const INVENTORY_MIN_UNITS = 3;
export const INVENTORY_ALERT_LEVELS = ['out_of_stock', 'critical', 'reorder'];
export const INVENTORY_LEVEL_ORDER = { out_of_stock: 0, critical: 1, reorder: 2, insufficient: 3, healthy: 4, inactive: 5 };
