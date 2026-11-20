// Chỉ đọc: kiểm tra SQL thật bằng CTE giả lập, không INSERT/UPDATE/DELETE dữ liệu.
process.env.NODE_ENV = 'test';
process.env.DOTENV_CONFIG_QUIET = 'true';
const { default: sequelize } = await import('../src/config/db.js');
const { default: assert } = await import('node:assert/strict');
const { getInventoryRows, getInventorySummary } = await import('../src/services/inventory-planning.service.js');
const { assessInventory } = await import('../src/utils/inventoryPlanning.js');
const now = new Date('2026-11-18T12:00:00Z');
const originalQuery = sequelize.query.bind(sequelize);

try {
    let captured;
    sequelize.query = async (sql, options) => { captured = { sql, options }; return []; };
    await getInventoryRows({ now });
    sequelize.query = originalQuery;
    const fixture = `WITH products AS (
        SELECT 1 id, 'slow' name, NULL image_url, 3 stock, 'active' status,
            DATE_SUB(:now, INTERVAL 60 DAY) created_at,
            7 reorder_lead_days, 7 reorder_safety_days, 28 demand_window_days, NULL inventory_available_since
        UNION ALL SELECT 2, 'fast', NULL, 3, 'active', DATE_SUB(:now, INTERVAL 60 DAY), 7, 7, 28, NULL
        UNION ALL SELECT 3, 'short_window', NULL, 3, 'active', DATE_SUB(:now, INTERVAL 60 DAY), 7, 7, 14, NULL
        UNION ALL SELECT 4, 'restocked', NULL, 3, 'active', DATE_SUB(:now, INTERVAL 60 DAY), 7, 7, 28, DATE_SUB(:now, INTERVAL 3 DAY)
        UNION ALL SELECT 5, 'new', NULL, 3, 'active', DATE_SUB(:now, INTERVAL 3 DAY), 7, 7, 28, NULL
        UNION ALL SELECT 6, 'inactive', NULL, 0, 'inactive', DATE_SUB(:now, INTERVAL 60 DAY), 7, 7, 28, NULL
        UNION ALL SELECT 7, 'empty', NULL, 0, 'active', DATE_SUB(:now, INTERVAL 60 DAY), 7, 7, 28, NULL
        UNION ALL SELECT 8, 'reorder', NULL, 10, 'active', DATE_SUB(:now, INTERVAL 60 DAY), 7, 7, 28, NULL
    ), orders AS (
        SELECT 1 id, 'confirmed' status, DATE_SUB(:now, INTERVAL 2 DAY) created_at
        UNION ALL SELECT 2, 'delivered', DATE_SUB(:now, INTERVAL 8 DAY)
        UNION ALL SELECT 3, 'pending', DATE_SUB(:now, INTERVAL 1 DAY)
        UNION ALL SELECT 4, 'cancelled', DATE_SUB(:now, INTERVAL 1 DAY)
        UNION ALL SELECT 5, 'returned', DATE_SUB(:now, INTERVAL 1 DAY)
        UNION ALL SELECT 6, 'delivered', DATE_SUB(:now, INTERVAL 60 DAY)
        UNION ALL SELECT 7, 'confirmed', DATE_ADD(:now, INTERVAL 1 DAY)
        UNION ALL SELECT 8, 'shipping', DATE_SUB(:now, INTERVAL 20 DAY)
        UNION ALL SELECT 9, 'processing', DATE_SUB(:now, INTERVAL 4 DAY)
        UNION ALL SELECT 10, 'confirmed', DATE_SUB(:now, INTERVAL 1 DAY)
    ), order_details AS (
        SELECT 1 order_id, 1 product_id, 3 quantity
        UNION ALL SELECT 2, 2, 28
        UNION ALL SELECT 3, 1, 900
        UNION ALL SELECT 4, 1, 900
        UNION ALL SELECT 5, 1, 900
        UNION ALL SELECT 6, 1, 900
        UNION ALL SELECT 7, 1, 900
        UNION ALL SELECT 8, 3, 90
        UNION ALL SELECT 9, 4, 200
        UNION ALL SELECT 10, 4, 3
        UNION ALL SELECT 2, 8, 28
    ) `;
    const rows = await originalQuery(fixture + captured.sql, captured.options);
    const byId = new Map(rows.map((row) => [Number(row.id), row]));
    assert.equal(rows.length, 7);
    assert.equal(Number(byId.get(1).demand_units), 3);
    assert.equal(Number(byId.get(3).demand_units), 0);
    assert.equal(Number(byId.get(4).demand_units), 3);
    assert.equal(assessInventory(byId.get(1), byId.get(1).demand_units, now).level, 'healthy');
    assert.equal(assessInventory(byId.get(2), byId.get(2).demand_units, now).level, 'critical');
    assert.equal(assessInventory(byId.get(4), byId.get(4).demand_units, now).level, 'insufficient');
    assert.equal(assessInventory(byId.get(7), 0, now).level, 'out_of_stock');
    assert.equal(assessInventory(byId.get(8), byId.get(8).demand_units, now).level, 'reorder');
    const live = await getInventorySummary();
    const { default: dashboard } = await import('../src/services/admin-dashboard.service.js');
    const { default: products } = await import('../src/services/product.service.js');
    const stats = await dashboard.getDashboardStats();
    assert.equal(stats.low_stock_count, live.alerts.length);
    assert.equal(stats.stock_review_count, live.review.length);
    const page = await products.getAdminAll({ limit: 1 });
    if (page.rows.length) assert.ok(page.rows[0].toJSON().inventory_health);
    console.log(JSON.stringify({ fixture_checks: 'passed', live_products: live.total, alerts: live.alerts.length, needs_review: live.review.length, healthy: live.healthy }));
} finally {
    sequelize.query = originalQuery;
    await sequelize.close();
}
