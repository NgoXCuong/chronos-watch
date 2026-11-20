import { DataTypes } from 'sequelize';
import { INVENTORY_DEFAULTS } from '../constants/inventoryPlanning.js';

// Chỉ thêm cột, không xóa hay cập nhật tồn kho hiện có. Chạy lại an toàn.
export async function migrateInventoryPlanning(sequelize) {
    const qi = sequelize.getQueryInterface();
    const columns = await qi.describeTable('products');
    for (const [name, defaultValue] of Object.entries(INVENTORY_DEFAULTS)) {
        if (!columns[name]) await qi.addColumn('products', name, { type: DataTypes.INTEGER, allowNull: false, defaultValue });
    }
    if (!columns.inventory_available_since) {
        await qi.addColumn('products', 'inventory_available_since', { type: DataTypes.DATE, allowNull: true, defaultValue: null });
    }
}
