import db from '../src/config/db.js';
import { migrateVoucherGrants } from '../src/migrations/voucherGrants.schema.js';
try { await migrateVoucherGrants(db); console.log('Đã tạo bảng người nhận voucher.'); }
catch (error) { console.error(error.message); process.exitCode = 1; }
finally { await db.close(); }
