import { QueryTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { assessInventory } from '../utils/inventoryPlanning.js';
import { INVENTORY_ALERT_LEVELS, INVENTORY_LEVEL_ORDER, INVENTORY_LIMITS } from '../constants/inventoryPlanning.js';

// Một truy vấn gộp cho toàn bộ SKU; cắt dữ liệu đơn theo cửa sổ tối đa trước JOIN.
export async function getInventoryRows({ ids, now = new Date() } = {}) {
    if (ids && ids.length === 0) return [];
    const rows = await sequelize.query(`
        SELECT p.id, p.name, p.image_url, p.stock, p.status, p.created_at,
               p.reorder_lead_days, p.reorder_safety_days, p.demand_window_days,
               p.inventory_available_since, COALESCE(SUM(s.quantity), 0) AS demand_units
        FROM products p
        LEFT JOIN (
            SELECT od.product_id, od.quantity, o.created_at
            FROM order_details od JOIN orders o ON o.id = od.order_id
            WHERE o.status IN ('confirmed', 'processing', 'shipping', 'delivered') AND od.quantity > 0
              AND o.created_at >= :earliest AND o.created_at <= :now
        ) s ON s.product_id = p.id
           AND s.created_at >= GREATEST(DATE_SUB(:now, INTERVAL p.demand_window_days DAY),
               p.created_at, COALESCE(p.inventory_available_since, p.created_at))
        WHERE ${ids ? 'p.id IN (:ids)' : "p.status = 'active'"}
        GROUP BY p.id, p.name, p.image_url, p.stock, p.status, p.created_at,
                 p.reorder_lead_days, p.reorder_safety_days, p.demand_window_days, p.inventory_available_since`, {
        type: QueryTypes.SELECT,
        replacements: { ids: ids || [], now, earliest: new Date(now.getTime() - INVENTORY_LIMITS.demand_window_days.max * 86400000) },
    });
    return rows.map((row) => ({ ...row, stock: Number(row.stock) || 0, inventory_health: assessInventory(row, row.demand_units, now) }));
}

export async function attachInventoryHealth(products) {
    const rows = await getInventoryRows({ ids: products.map(({ id }) => id) });
    const byId = new Map(rows.map((row) => [Number(row.id), row.inventory_health]));
    for (const product of products) {
        const health = byId.get(Number(product.id)) || null;
        if (product.setDataValue) product.setDataValue('inventory_health', health);
        else product.inventory_health = health;
    }
    return products;
}

export async function getInventorySummary() {
    const rows = await getInventoryRows();
    rows.sort((a, b) => INVENTORY_LEVEL_ORDER[a.inventory_health.level] - INVENTORY_LEVEL_ORDER[b.inventory_health.level]
        || (a.inventory_health.days_of_cover ?? Infinity) - (b.inventory_health.days_of_cover ?? Infinity)
        || a.stock - b.stock || a.id - b.id);
    const alerts = rows.filter(({ inventory_health: h }) => INVENTORY_ALERT_LEVELS.includes(h.level));
    const review = rows.filter(({ inventory_health: h }) => h.level === 'insufficient');
    return {
        alerts, review, total: rows.length,
        out_of_stock: alerts.filter(({ inventory_health: h }) => h.level === 'out_of_stock').length,
        healthy: rows.filter(({ inventory_health: h }) => h.level === 'healthy').length,
    };
}
