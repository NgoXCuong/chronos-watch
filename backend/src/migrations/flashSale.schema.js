// Di trú riêng cho mảng Flash Sale (migrate.js đã ~270 dòng, gộp thêm là vượt Rule 1).
// Mọi câu SQL idempotent — chạy `npm run migrate` nhiều lần không nhân bản dữ liệu.

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

const indexExists = async (sequelize, table, index) => {
    const [rows] = await sequelize.query(
        `SELECT COUNT(1) AS count FROM information_schema.statistics
         WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ?`,
        { replacements: [table, index] }
    );
    return Number(rows[0]?.count) > 0;
};

const createTables = async (sequelize) => {
    await runSafe(
        sequelize,
        'Bảng flash_sales',
        `CREATE TABLE IF NOT EXISTS \`flash_sales\` (
          \`id\`          INT          NOT NULL AUTO_INCREMENT,
          \`name\`        VARCHAR(120) NOT NULL,
          \`description\` TEXT         DEFAULT NULL,
          \`start_date\`  DATETIME     NOT NULL,
          \`end_date\`    DATETIME     NOT NULL,
          \`status\`      ENUM('active','inactive') NOT NULL DEFAULT 'active',
          \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          KEY \`idx_flash_window\` (\`status\`, \`start_date\`, \`end_date\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    );

    await runSafe(
        sequelize,
        'Bảng flash_sale_items',
        `CREATE TABLE IF NOT EXISTS \`flash_sale_items\` (
          \`id\`             INT            NOT NULL AUTO_INCREMENT,
          \`flash_sale_id\`  INT            NOT NULL,
          \`product_id\`     INT            NOT NULL,
          \`flash_price\`    DECIMAL(15,0)  NOT NULL,
          \`quota\`          INT            NOT NULL DEFAULT 0,
          \`sold_count\`     INT            NOT NULL DEFAULT 0,
          \`per_user_limit\` INT            NOT NULL DEFAULT 1,
          \`created_at\`     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\`     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`unique_flash_product\` (\`flash_sale_id\`, \`product_id\`),
          KEY \`idx_flash_item_product\` (\`product_id\`),
          CONSTRAINT \`fk_fsi_flash\`   FOREIGN KEY (\`flash_sale_id\`) REFERENCES \`flash_sales\` (\`id\`) ON DELETE CASCADE,
          CONSTRAINT \`fk_fsi_product\` FOREIGN KEY (\`product_id\`)   REFERENCES \`products\` (\`id\`)  ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    );
};

// Đơn hàng nhớ suất flash đã mua để hủy/hoàn là trừ lại quota. ON DELETE SET NULL:
// xóa đợt flash không được làm mất dòng đơn history.
const addOrderDetailColumn = async (sequelize) => {
    if (await columnExists(sequelize, 'order_details', 'flash_sale_item_id')) {
        console.log('  - Cột [order_details.flash_sale_item_id] đã tồn tại (bỏ qua).');
    } else {
        await runSafe(
            sequelize,
            'order_details.flash_sale_item_id',
            `ALTER TABLE \`order_details\` ADD COLUMN \`flash_sale_item_id\` INT DEFAULT NULL
             COMMENT 'Suất Flash Sale đã mua (NULL = giá thường)' AFTER \`price\`;`
        );
    }
    if (!(await indexExists(sequelize, 'order_details', 'idx_od_flash_item'))) {
        await runSafe(
            sequelize,
            'Index order_details.flash_sale_item_id',
            `ALTER TABLE \`order_details\` ADD KEY \`idx_od_flash_item\` (\`flash_sale_item_id\`)`
        );
    }
    await runSafe(
        sequelize,
        'FK order_details -> flash_sale_items',
        `ALTER TABLE \`order_details\`
           ADD CONSTRAINT \`fk_od_flash_item\` FOREIGN KEY (\`flash_sale_item_id\`)
           REFERENCES \`flash_sale_items\` (\`id\`) ON DELETE SET NULL;`
    );
};

export const migrateFlashSaleSchema = async (sequelize) => {
    await createTables(sequelize);
    await addOrderDetailColumn(sequelize);
};

export default migrateFlashSaleSchema;
