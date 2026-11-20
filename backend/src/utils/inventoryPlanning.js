import AppError from './AppError.js';
import { INVENTORY_DEFAULTS, INVENTORY_LIMITS, INVENTORY_MIN_HISTORY_DAYS, INVENTORY_MIN_UNITS } from '../constants/inventoryPlanning.js';

const DAY_MS = 86400000;
const round = (value) => Math.round(value * 100) / 100;

export function parseInventorySettings(data) {
    const result = {};
    for (const [key, { min, max, label }] of Object.entries(INVENTORY_LIMITS)) {
        if (data[key] === undefined) continue;
        const value = String(data[key]).trim();
        const num = Number(value);
        if (!/^\d+$/.test(value) || !Number.isSafeInteger(num) || num < min || num > max) {
            throw new AppError(400, `${label} phải là số nguyên từ ${min} đến ${max} ngày.`);
        }
        result[key] = num;
    }
    return result;
}

export function inventoryObservationStart(product, now = new Date()) {
    const window = Number(product.demand_window_days) || INVENTORY_DEFAULTS.demand_window_days;
    const created = new Date(product.created_at).getTime();
    const available = product.inventory_available_since ? new Date(product.inventory_available_since).getTime() : created;
    if (!Number.isFinite(created) || !Number.isFinite(available)) return null;
    return new Date(Math.max(now.getTime() - window * DAY_MS, created, available));
}

// stock đã trừ khi đặt đơn: dùng trực tiếp, không trừ lượng giữ hàng lần thứ hai.
export function assessInventory(product, units = 0, now = new Date()) {
    const lead = Number(product.reorder_lead_days) || INVENTORY_DEFAULTS.reorder_lead_days;
    const safety = product.reorder_safety_days == null ? INVENTORY_DEFAULTS.reorder_safety_days : Number(product.reorder_safety_days);
    const start = inventoryObservationStart(product, now);
    const days = start ? Math.max(0, (now - start) / DAY_MS) : 0;
    const sold = Math.max(0, Number(units) || 0);
    const daily = days > 0 ? sold / days : 0;
    const stock = Math.max(0, Number(product.stock) || 0);
    const enoughData = days >= INVENTORY_MIN_HISTORY_DAYS && sold >= INVENTORY_MIN_UNITS;
    const cover = enoughData && daily > 0 ? stock / daily : null;
    let level = 'healthy';
    let reason = null;
    if (product.status !== 'active') level = 'inactive';
    else if (stock === 0) level = 'out_of_stock';
    else if (!enoughData) {
        level = 'insufficient';
        reason = days < INVENTORY_MIN_HISTORY_DAYS ? 'short_history' : 'few_sales';
    } else if (cover <= lead) level = 'critical';
    else if (cover <= lead + safety) level = 'reorder';

    return {
        level, reason, units_sold: sold, observation_days: round(days),
        window_days: Number(product.demand_window_days) || INVENTORY_DEFAULTS.demand_window_days,
        average_daily_sales: round(daily), days_of_cover: cover === null ? null : round(cover),
        reorder_point: enoughData ? round(daily * (lead + safety)) : null,
        lead_days: lead, safety_days: safety,
    };
}
