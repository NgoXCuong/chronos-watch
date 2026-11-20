import sequelize from '../src/config/db.js';
import { migrateInventoryPlanning } from '../src/migrations/inventoryPlanning.schema.js';

try {
    await migrateInventoryPlanning(sequelize);
    console.log('Đã bổ sung cấu hình cảnh báo tồn kho theo nhu cầu.');
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    await sequelize.close();
}
