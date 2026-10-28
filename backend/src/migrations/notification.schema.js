// Di trú riêng cho bảng notifications (Rule 1: migrate.js đã dài).
// Toàn bộ câu lệnh idempotent — chạy lại `npm run migrate` không nhân bản dữ liệu.

const THRESHOLD = 10;

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

const createTables = async (sequelize) => {
    await runSafe(
        sequelize,
        'Bảng notifications',
        `CREATE TABLE IF NOT EXISTS \`notifications\` (
          \`id\` INT NOT NULL AUTO_INCREMENT,
          \`user_id\` INT NOT NULL,
          \`type\` ENUM('order','payment','stock','review','warranty','system') NOT NULL DEFAULT 'system',
          \`title\` VARCHAR(200) NOT NULL,
          \`message\` VARCHAR(500) NOT NULL,
          \`link\` VARCHAR(255) DEFAULT NULL,
          \`dedupe_key\` VARCHAR(120) DEFAULT NULL,
          \`read_at\` DATETIME DEFAULT NULL,
          \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          KEY \`idx_notif_user_created\` (\`user_id\`, \`created_at\`),
          KEY \`idx_notif_user_unread\` (\`user_id\`, \`read_at\`),
          KEY \`idx_notif_dedupe\` (\`dedupe_key\`),
          CONSTRAINT \`fk_notif_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    );
};

const adminIds = async (sequelize) => {
    const [rows] = await sequelize.query(
        `SELECT id FROM users WHERE role = 'admin' AND status = 'active'`
    );
    return rows.map((r) => Number(r.id));
};

const existingKeys = async (sequelize) => {
    const [rows] = await sequelize.query(
        `SELECT user_id, dedupe_key FROM notifications WHERE dedupe_key IS NOT NULL`
    );
    return new Set(rows.map((r) => `${r.user_id}:${r.dedupe_key}`));
};

const insertOne = (sequelize, row) =>
    runSafe(
        sequelize,
        `Thông báo ${row.dedupe_key}`,
        `INSERT INTO \`notifications\`
           (user_id, type, title, message, link, dedupe_key, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [row.user_id, row.type, row.title, row.message, row.link, row.dedupe_key, row.created_at]
    );

// Backfill cho dữ liệu ĐANG có: đơn chờ xử lý 7 ngày gần nhất + sản phẩm sắp hết.
// Nhờ vậy chuông admin không trống trơn ngay sau khi nâng cấp.
const backfill = async (sequelize) => {
    const admins = await adminIds(sequelize);
    if (!admins.length) return;

    const seen = await existingKeys(sequelize);
    const [orders] = await sequelize.query(
        `SELECT id, order_code, full_name, total_amount, created_at
           FROM orders
          WHERE status = 'pending' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          ORDER BY created_at DESC
          LIMIT 20`
    );
    const [products] = await sequelize.query(
        `SELECT id, name, stock, updated_at
           FROM products
          WHERE stock <= ?
          ORDER BY stock ASC
          LIMIT 20`,
        { replacements: [THRESHOLD] }
    );

    for (const adminId of admins) {
        for (const order of orders) {
            const key = `order-${order.id}`;
            if (seen.has(`${adminId}:${key}`)) continue;
            await insertOne(sequelize, {
                user_id: adminId,
                type: 'order',
                title: 'Đơn hàng mới',
                message: `Khách ${order.full_name || 'vãng lai'} vừa đặt đơn ${order.order_code || `#${order.id}`} · ${Number(order.total_amount || 0).toLocaleString('vi-VN')}đ.`,
                link: `/admin/orders/${order.id}`,
                dedupe_key: key,
                created_at: order.created_at,
            });
        }
        for (const product of products) {
            const key = `stock-${product.id}`;
            if (seen.has(`${adminId}:${key}`)) continue;
            await insertOne(sequelize, {
                user_id: adminId,
                type: 'stock',
                title: Number(product.stock) <= 0 ? 'Hết hàng' : 'Sắp hết hàng',
                message: `Sản phẩm ${product.name} chỉ còn ${Number(product.stock)} trong kho.`,
                link: '/admin/products',
                dedupe_key: key,
                created_at: product.updated_at || new Date(),
            });
        }
    }
};

export const migrateNotificationSchema = async (sequelize) => {
    await createTables(sequelize);
    await backfill(sequelize);
};
