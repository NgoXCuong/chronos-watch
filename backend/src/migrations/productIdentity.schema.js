import { generateSku } from "../utils/productIdentity.js";

export async function migrateProductIdentity(sequelize) {
    const qi = sequelize.getQueryInterface();
    const columns = await qi.describeTable('products');
    if (columns.model_code) {
        await qi.removeColumn('products', 'model_code');
    }
    // Giữ nguyên SKU đã cấp cho sản phẩm.
    const [rows] = await sequelize.query("SELECT id FROM products WHERE sku IS NULL OR TRIM(sku) = ''");
    for (const row of rows) {
        await sequelize.query("UPDATE products SET sku = ? WHERE id = ? AND (sku IS NULL OR TRIM(sku) = '')",
            { replacements: [generateSku(), row.id] });
    }
    // Chỉ bổ sung snapshot trống; không sửa mã đã lưu trong đơn/phiếu cũ.
    await sequelize.query(`UPDATE order_details od JOIN products p ON p.id = od.product_id
        SET od.sku = p.sku WHERE od.sku IS NULL OR TRIM(od.sku) = ''`);
    await sequelize.query(`UPDATE warranties w JOIN products p ON p.id = w.product_id
        SET w.sku = p.sku WHERE w.sku IS NULL OR TRIM(w.sku) = ''`);
    console.log(`Đã cấp SKU cho ${rows.length} sản phẩm còn thiếu.`);
}
