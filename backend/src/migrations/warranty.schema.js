import { buildWarrantyCode, warrantyEndDate } from '../utils/warranty.js';

// Di trú riêng cho mảng bảo hành: migrate.js đã ~265 dòng, gộp thêm là vượt Rule 1.
// Mọi câu SQL ở đây idempotent — chạy lại migrate nhiều lần không nhân bản dữ liệu.

const DEFAULT_WARRANTY_MONTHS = 12;

const runSafe = async (sequelize, label, sql, replacements) => {
    try {
        await sequelize.query(sql, replacements ? { replacements } : undefined);
        console.log(`  + ${label}`);
        return true;
    } catch (err) {
        console.warn(`  ! Bỏ qua [${label}]:`, err.message);
        return false;
    }
};

const columnExists = async (sequelize, table, column) => {
    const [rows] = await sequelize.query(
        `SELECT COUNT(1) AS count FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
        { replacements: [table, column] }
    );
    return Number(rows[0]?.count) > 0;
};

const createTables = async (sequelize) => {
    await runSafe(
        sequelize,
        'Bảng warranties',
        `CREATE TABLE IF NOT EXISTS \`warranties\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`code\` VARCHAR(40) NOT NULL,
          \`order_id\` INT NOT NULL,
          \`order_detail_id\` INT NOT NULL,
          \`user_id\` INT NOT NULL,
          \`product_id\` INT DEFAULT NULL,
          \`product_name\` VARCHAR(255) DEFAULT NULL,
          \`sku\` VARCHAR(50) DEFAULT NULL,
          \`serial\` VARCHAR(50) DEFAULT NULL,
          \`warranty_months\` INT NOT NULL,
          \`start_date\` DATETIME NOT NULL,
          \`end_date\` DATETIME NOT NULL,
          \`status\` ENUM('active','processing','closed','void') NOT NULL DEFAULT 'active',
          \`note\` TEXT DEFAULT NULL,
          \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`unique_warranty_code\` (\`code\`),
          UNIQUE KEY \`unique_warranty_serial\` (\`serial\`),
          KEY \`idx_warranty_user\` (\`user_id\`),
          KEY \`idx_warranty_order\` (\`order_id\`),
          KEY \`idx_warranty_end\` (\`end_date\`),
          CONSTRAINT \`fk_warranty_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_warranty_detail\` FOREIGN KEY (\`order_detail_id\`) REFERENCES \`order_details\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_warranty_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_warranty_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    );

    await runSafe(
        sequelize,
        'Bảng warranty_requests',
        `CREATE TABLE IF NOT EXISTS \`warranty_requests\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`warranty_id\` INT NOT NULL,
          \`user_id\` INT NOT NULL,
          \`issue\` TEXT NOT NULL,
          \`status\` ENUM('pending','processing','done','rejected') NOT NULL DEFAULT 'pending',
          \`admin_reply\` TEXT DEFAULT NULL,
          \`replied_at\` DATETIME DEFAULT NULL,
          \`handled_by\` INT DEFAULT NULL,
          \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          KEY \`idx_wreq_warranty\` (\`warranty_id\`),
          KEY \`idx_wreq_status\` (\`status\`),
          CONSTRAINT \`fk_wreq_warranty\` FOREIGN KEY (\`warranty_id\`) REFERENCES \`warranties\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_wreq_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_wreq_handler\` FOREIGN KEY (\`handled_by\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    );

    if (!(await columnExists(sequelize, 'order_details', 'warranty_months'))) {
        await runSafe(
            sequelize,
            'order_details.warranty_months',
            `ALTER TABLE \`order_details\` ADD COLUMN \`warranty_months\` INT DEFAULT NULL
             COMMENT 'Snapshot thời hạn bảo hành (tháng) lúc mua' AFTER \`sku\`;`
        );
    }
};

// Snapshot thời hạn cho các dòng đơn cũ chưa có: lấy theo sản phẩm hiện tại
// (giá trị tốt nhất còn suy ra được), không để NULL vì phiếu cần end_date.
const backfillOrderDetailSnapshot = async (sequelize) => {
    await runSafe(
        sequelize,
        'Backfill order_details.warranty_months',
        `UPDATE order_details od
           JOIN products p ON p.id = od.product_id
         SET od.warranty_months = COALESCE(p.warranty_months, ${DEFAULT_WARRANTY_MONTHS})
         WHERE od.warranty_months IS NULL;`
    );
};

// Mốc bắt đầu bảo hành = lần đầu đơn được chuyển sang 'delivered'; đơn cũ chưa có
// lịch sử thì dùng updated_at của đơn (không dùng created_at — khách chưa nhận hàng).
const deliveredAtMap = async (sequelize) => {
    const [rows] = await sequelize.query(
        `SELECT o.id AS order_id,
                COALESCE(MIN(CASE WHEN oh.status = 'delivered' THEN oh.created_at END), o.updated_at) AS start_at
           FROM orders o
           LEFT JOIN order_history oh ON oh.order_id = o.id
          WHERE o.status = 'delivered'
          GROUP BY o.id, o.updated_at`
    );
    return new Map(rows.map((r) => [Number(r.order_id), new Date(r.start_at)]));
};

export const backfillWarranties = async (sequelize) => {
    const starts = await deliveredAtMap(sequelize);
    const [details] = await sequelize.query(
        `SELECT od.id, od.order_id, od.product_id,
                COALESCE(od.product_name, p.name) AS product_name,
                COALESCE(od.sku, p.sku) AS sku,
                od.quantity, od.warranty_months, o.user_id, o.order_code, o.status AS order_status,
                (SELECT COUNT(*) FROM warranties w WHERE w.order_detail_id = od.id) AS existing
           FROM order_details od
           JOIN orders o ON o.id = od.order_id
           LEFT JOIN products p ON p.id = od.product_id
          WHERE o.status IN ('delivered','returned')
            AND od.quantity > 0`
    );

    // Bộ đếm mã theo TỪNG ĐƠN (không theo dòng): hai dòng của cùng một đơn mà đều
    // dùng i+1 thì sẽ cho ra W01 trùng nhau, vi phạm unique_warranty_code.
    // Khởi tạo từ số phiếu đã có để chạy migrate lần 2 không sinh lại mã đã dùng.
    const [existingByOrder] = await sequelize.query(
        `SELECT order_id, COUNT(*) AS count FROM warranties GROUP BY order_id`
    );
    const seqByOrder = new Map(existingByOrder.map((r) => [Number(r.order_id), Number(r.count)]));
    const nextSeq = (orderId) => {
        const next = (seqByOrder.get(orderId) ?? 0) + 1;
        seqByOrder.set(orderId, next);
        return next;
    };

    let created = 0;
    for (const d of details) {
        const qty = Number(d.quantity) || 1;
        const missing = qty - Number(d.existing);
        if (missing <= 0) continue;
        const start = starts.get(Number(d.order_id)) ?? new Date();
        const months = Number(d.warranty_months) || DEFAULT_WARRANTY_MONTHS;
        // Đơn 'returned' → phiếu lập ra ở trạng thái void để lịch sử vẫn tra được.
        const status = d.order_status === 'returned' ? 'void' : 'active';
        for (let i = 0; i < missing; i += 1) {
            const code = buildWarrantyCode(d.order_code, nextSeq(d.order_id));
            await runSafe(
                sequelize,
                `Phiếu ${code}`,
                `INSERT INTO warranties
                   (code, order_id, order_detail_id, user_id, product_id, product_name, sku,
                    warranty_months, start_date, end_date, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    code,
                    d.order_id,
                    d.id,
                    d.user_id,
                    d.product_id ?? null,
                    d.product_name ?? null,
                    d.sku ?? null,
                    months,
                    start,
                    warrantyEndDate(start, months),
                    status,
                ]
            );
            created += 1;
        }
    }
    console.log(`  + Backfill warranties: tạo mới ${created} phiếu.`);
    return created;
};

export const migrateWarrantySchema = async (sequelize) => {
    await createTables(sequelize);
    await backfillOrderDetailSnapshot(sequelize);
    await backfillWarranties(sequelize);
    // Phiếu đã lập trước đây từ dòng đơn có snapshot NULL → vá tên/SKU từ products
    await runSafe(
        sequelize,
        'Vá product_name/sku cho warranties',
        `UPDATE warranties w
           JOIN products p ON p.id = w.product_id
            SET w.product_name = COALESCE(w.product_name, p.name),
                w.sku          = COALESCE(w.sku, p.sku)
          WHERE w.product_name IS NULL OR w.sku IS NULL;`
    );
};
