import sequelize from '../src/config/db.js';
import { migratePublicVouchers } from '../src/migrations/publicVouchers.schema.js';
try { await migratePublicVouchers(sequelize); console.log('Đã thêm chế độ công khai voucher; các mã cũ vẫn riêng tư.'); }
catch (error) { console.error(error.message); process.exitCode = 1; }
finally { await sequelize.close(); }
