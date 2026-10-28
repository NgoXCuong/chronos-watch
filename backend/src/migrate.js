import sequelize from './config/db.js';
import { migrateWarrantySchema } from './migrations/warranty.schema.js';
import { migrateFlashSaleSchema } from './migrations/flashSale.schema.js';
import { migrateNotificationSchema } from './migrations/notification.schema.js';

async function runMigration() {
  console.log('🚀 Bắt đầu quá trình cập nhật cấu trúc Database (Không mất dữ liệu)...');

  try {
    // 1. Tạo bảng token_blacklist nếu chưa tồn tại (hỗ trợ logout vô hiệu hóa JWT)
    console.log('⌛ 1. Kiểm tra và tạo bảng token_blacklist...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`token_blacklist\` (
        \`token_hash\` CHAR(64)    NOT NULL,
        \`expires_at\` DATETIME    NOT NULL,
        PRIMARY KEY (\`token_hash\`),
        KEY \`idx_token_blacklist_expires\` (\`expires_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Bảng token_blacklist đã sẵn sàng.');

    // 2. Tạo bảng voucher_usages nếu chưa tồn tại
    console.log('⌛ 2. Kiểm tra và tạo bảng voucher_usages...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`voucher_usages\` (
        \`id\`         INT       NOT NULL AUTO_INCREMENT,
        \`voucher_id\` INT       NOT NULL,
        \`user_id\`    INT       DEFAULT NULL,
        \`order_id\`   INT       DEFAULT NULL,
        \`used_at\`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`unique_vu_voucher_order\` (\`voucher_id\`, \`order_id\`),
        KEY \`idx_vu_voucher_user\` (\`voucher_id\`, \`user_id\`),
        KEY \`idx_vu_order\` (\`order_id\`),
        CONSTRAINT \`fk_vu_voucher\` FOREIGN KEY (\`voucher_id\`) REFERENCES \`vouchers\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_vu_user\`    FOREIGN KEY (\`user_id\`)    REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_vu_order\`   FOREIGN KEY (\`order_id\`)   REFERENCES \`orders\` (\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Bảng voucher_usages đã sẵn sàng.');

    // Helper kiểm tra và tạo Index an toàn
    const addIndexIfNotExists = async (tableName, indexName, indexDefinition) => {
      const [results] = await sequelize.query(`
        SELECT COUNT(1) as count
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = '${tableName}'
          AND index_name = '${indexName}';
      `);

      if (results[0].count === 0 || results[0].count === '0') {
        try {
          await sequelize.query(`ALTER TABLE \`${tableName}\` ADD ${indexDefinition};`);
          console.log(`  + Đã tạo Index [${indexName}] trên bảng [${tableName}]`);
        } catch (err) {
          console.warn(`  ! Không thể tạo Index [${indexName}] trên [${tableName}]:`, err.message);
        }
      } else {
        console.log(`  - Index [${indexName}] trên bảng [${tableName}] đã tồn tại (bỏ qua).`);
      }
    };

    console.log('\n⏳ 3. Thêm các Index tối ưu hóa truy vấn...');

    // Helper kiểm tra và tạo Cột an toàn
    const addColumnIfNotExists = async (tableName, columnName, columnDefinition) => {
        const [cols] = await sequelize.query(`
            SELECT COUNT(1) as count
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = '${tableName}'
              AND column_name = '${columnName}';
        `);
        if (cols[0].count === 0 || cols[0].count === '0') {
            try {
                await sequelize.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDefinition};`);
                console.log(`  + Đã thêm Cột [${columnName}] vào bảng [${tableName}]`);
            } catch (err) {
                console.warn(`  ! Không thể thêm Cột [${columnName}] vào [${tableName}]:`, err.message);
            }
        } else {
            console.log(`  - Cột [${columnName}] trên bảng [${tableName}] đã tồn tại (bỏ qua).`);
        }
    };

    // 2b. Tạo bảng banners nếu chưa tồn tại (quản lý slider trang chủ từ Admin)
    console.log('⌛ 2b. Kiểm tra và tạo bảng banners...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`banners\` (
        \`id\`         INT           NOT NULL AUTO_INCREMENT,
        \`eyebrow\`    VARCHAR(100)  DEFAULT NULL,
        \`title\`      VARCHAR(255)  NOT NULL,
        \`subtitle\`   VARCHAR(500)  DEFAULT NULL,
        \`image_url\`  VARCHAR(500)  NOT NULL,
        \`link_url\`   VARCHAR(255)  DEFAULT NULL,
        \`sort_order\` INT           DEFAULT 0,
        \`is_active\`  TINYINT(1)    DEFAULT 1,
        \`start_date\` DATETIME      DEFAULT NULL,
        \`end_date\`   DATETIME      DEFAULT NULL,
        \`created_at\` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_banners_active_order\` (\`is_active\`, \`sort_order\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Bảng banners đã sẵn sàng.');

    // 2c. Thêm các cột mới cho phiên bản nâng cấp TMĐT
    console.log('⌛ 2c. Kiểm tra và bổ sung cột sku (products), image_url (categories)...');
    await addColumnIfNotExists('products', 'sku', "VARCHAR(50) DEFAULT NULL COMMENT 'Mã sản phẩm ngành đồng hồ' AFTER `slug`");
    await addColumnIfNotExists('categories', 'image_url', "VARCHAR(255) DEFAULT NULL AFTER `description`");
    await addIndexIfNotExists('products', 'unique_product_sku', 'UNIQUE KEY `unique_product_sku` (`sku`)');

    // Index cho user_addresses
    await addIndexIfNotExists('user_addresses', 'idx_address_user_default', 'KEY `idx_address_user_default` (`user_id`, `is_default`)');

    // Index cho categories
    await addIndexIfNotExists('categories', 'idx_category_parent', 'KEY `idx_category_parent` (`parent_id`)');

    // Index cho products
    await addIndexIfNotExists('products', 'idx_products_status_brand_price', 'KEY `idx_products_status_brand_price` (`status`, `brand_id`, `price`)');
    await addIndexIfNotExists('products', 'idx_products_status_views', 'KEY `idx_products_status_views` (`status`, `views`)');
    await addIndexIfNotExists('products', 'idx_products_status_sold', 'KEY `idx_products_status_sold` (`status`, `sold_count`)');
    await addIndexIfNotExists('products', 'idx_products_created', 'KEY `idx_products_created` (`created_at`)');
    await addIndexIfNotExists('products', 'ft_product_search', 'FULLTEXT KEY `ft_product_search` (`name`)');

    // Index cho product_categories
    await addIndexIfNotExists('product_categories', 'idx_pc_category_id', 'KEY `idx_pc_category_id` (`category_id`)');

    // Index cho vouchers
    await addIndexIfNotExists('vouchers', 'idx_vouchers_status_dates', 'KEY `idx_vouchers_status_dates` (`status`, `start_date`, `end_date`)');

    // Index cho orders
    await addIndexIfNotExists('orders', 'idx_orders_status_created', 'KEY `idx_orders_status_created` (`status`, `created_at`)');
    await addIndexIfNotExists('orders', 'idx_orders_user_created', 'KEY `idx_orders_user_created` (`user_id`, `created_at`)');

    // Index cho order_details
    await addIndexIfNotExists('order_details', 'idx_od_product', 'KEY `idx_od_product` (`product_id`)');

    // Index cho order_history
    await addIndexIfNotExists('order_history', 'idx_history_order', 'KEY `idx_history_order` (`order_id`)');

    // Index cho carts & wishlists
    await addIndexIfNotExists('carts', 'idx_cart_prod', 'KEY `idx_cart_prod` (`product_id`)');
    await addIndexIfNotExists('wishlists', 'idx_wishlist_prod', 'KEY `idx_wishlist_prod` (`product_id`)');

    // Index cho reviews
    await addIndexIfNotExists('reviews', 'idx_reviews_prod_active_rating', 'KEY `idx_reviews_prod_active_rating` (`product_id`, `is_active`, `rating`)');
    await addIndexIfNotExists('reviews', 'idx_reviews_user', 'KEY `idx_reviews_user` (`user_id`)');

    // 3. Cập nhật kiểu timestamp của vouchers nếu cần
    console.log('\n⏳ 4. Chuẩn hóa timestamps bảng vouchers...');
    try {
      await sequelize.query(`
        ALTER TABLE \`vouchers\`
        MODIFY \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        MODIFY \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
      `);
      console.log('✅ Đã chuẩn hóa timestamps bảng vouchers.');
    } catch (err) {
      console.warn('  ! Bỏ qua cập nhật timestamps vouchers:', err.message);
    }

    // Helper: chạy 1 câu ALTER an toàn (idempotent, chỉ cảnh báo khi lỗi)
    const runSafe = async (label, sql) => {
      try {
        await sequelize.query(sql);
        console.log(`  + ${label}`);
      } catch (err) {
        console.warn(`  ! Bỏ qua [${label}]:`, err.message);
      }
    };

    // ============================================================
    // 5. NÂNG CẤP SCHEMA THEO AUDIT TMĐT (giữ nguyên dữ liệu cũ)
    // ============================================================
    console.log('\n⏳ 5. Nâng cấp schema theo audit TMĐT (products/orders/order_details/order_history/vouchers/voucher_usages/reviews)...');

    // 5a. Thống nhất COLLATE cho các bảng còn thiếu (tránh lệch utf8mb4_0900_ai_ci)
    for (const tbl of ['carts', 'wishlists', 'reviews', 'token_blacklist']) {
      await runSafe(
        `Collate ${tbl} -> utf8mb4_unicode_ci`,
        `ALTER TABLE \`${tbl}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
      );
    }

    // 5b. products: warranty_months, avg_rating, review_count
    await addColumnIfNotExists('products', 'warranty_months', "INT DEFAULT 24 COMMENT 'Bảo hành (tháng)' AFTER `stock`");
    await addColumnIfNotExists('products', 'avg_rating', "DECIMAL(2,1) DEFAULT 0 COMMENT 'Điểm TB (denormalized)' AFTER `sold_count`");
    await addColumnIfNotExists('products', 'review_count', "INT DEFAULT 0 COMMENT 'Số đánh giá (denormalized)' AFTER `avg_rating`");

    // 5c. orders: order_code, cancel_reason, updated_at + mở rộng payment_status
    await addColumnIfNotExists('orders', 'order_code', "VARCHAR(20) DEFAULT NULL COMMENT 'Mã đơn hiển thị cho khách' AFTER `id`");
    await addIndexIfNotExists('orders', 'unique_order_code', 'UNIQUE KEY `unique_order_code` (`order_code`)');
    await addColumnIfNotExists('orders', 'cancel_reason', "VARCHAR(255) DEFAULT NULL AFTER `payment_status`");
    await addColumnIfNotExists('orders', 'updated_at', "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`");
    await runSafe(
      'orders.payment_status -> thêm pending/failed',
      `ALTER TABLE \`orders\` MODIFY \`payment_status\` ENUM('pending','unpaid','paid','refunded','failed') NOT NULL DEFAULT 'unpaid';`
    );

    // 5d. order_details: snapshot product_name, product_image, sku
    await addColumnIfNotExists('order_details', 'product_name', "VARCHAR(255) DEFAULT NULL COMMENT 'Snapshot tên SP lúc mua' AFTER `product_id`");
    await addColumnIfNotExists('order_details', 'product_image', "VARCHAR(255) DEFAULT NULL COMMENT 'Snapshot ảnh SP lúc mua' AFTER `product_name`");
    await addColumnIfNotExists('order_details', 'sku', "VARCHAR(50) DEFAULT NULL COMMENT 'Snapshot SKU lúc mua' AFTER `product_image`");

    // 5e. order_history: changed_by + FK (admin/user đổi trạng thái)
    await addColumnIfNotExists('order_history', 'changed_by', "INT DEFAULT NULL COMMENT 'Người đổi trạng thái' AFTER `note`");
    await addIndexIfNotExists('order_history', 'idx_history_changed_by', 'KEY `idx_history_changed_by` (`changed_by`)');
    await runSafe(
      'order_history FK changed_by',
      `ALTER TABLE \`order_history\` ADD CONSTRAINT \`fk_history_user\` FOREIGN KEY (\`changed_by\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL;`
    );

    // 5f. voucher_usages: user_id cho phép NULL + UNIQUE(voucher_id, order_id)
    await runSafe(
      'voucher_usages.user_id -> NULL',
      `ALTER TABLE \`voucher_usages\` MODIFY \`user_id\` INT DEFAULT NULL;`
    );
    await addIndexIfNotExists('voucher_usages', 'unique_vu_voucher_order', 'UNIQUE KEY `unique_vu_voucher_order` (`voucher_id`, `order_id`)');

    // 5g. vouchers: per_user_limit
    await addColumnIfNotExists('vouchers', 'per_user_limit', "INT DEFAULT 1 COMMENT 'Số lượt tối đa mỗi user' AFTER `usage_limit`");

    // 5h. reviews: UNIQUE(user_id, product_id)
    await addIndexIfNotExists('reviews', 'unique_review_user_product', 'UNIQUE KEY `unique_review_user_product` (`user_id`, `product_id`)');

    // 5i. Backfill order_code cho các đơn hàng cũ chưa có mã
    console.log('  ⏳ Backfill order_code cho đơn hàng cũ...');
    try {
      const [rows] = await sequelize.query('SELECT id, created_at FROM orders WHERE order_code IS NULL');
      const genCode = (d) => {
        const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
        return `CHR-${ymd}-${rand}`;
      };
      let bf = 0;
      for (const r of rows) {
        const when = r.created_at ? new Date(r.created_at) : new Date();
        await sequelize.query('UPDATE orders SET order_code = ? WHERE id = ?', { replacements: [genCode(when), r.id] });
        bf++;
      }
      console.log(`  + Đã gán ${bf} order_code còn thiếu.`);
    } catch (err) {
      console.warn('  ! Bỏ qua backfill order_code:', err.message);
    }

    // 5j. Backfill avg_rating & review_count cho products từ reviews hiện có
    console.log('  ⏳ Backfill avg_rating/review_count cho sản phẩm...');
    await runSafe(
      'Backfill rating aggregates',
      `UPDATE products p
         LEFT JOIN (
           SELECT product_id, ROUND(AVG(rating), 1) ar, COUNT(*) rc
           FROM reviews WHERE is_active = 1 GROUP BY product_id
         ) r ON r.product_id = p.id
       SET p.avg_rating = COALESCE(r.ar, 0), p.review_count = COALESCE(r.rc, 0);`
    );

    // ============================================================
    // 6. MẢNG BẢO HÀNH (bảng warranties + warranty_requests, snapshot warranty_months)
    //    Tách sang migrations/warranty.schema.js để migrate.js không vượt Rule 1.
    // ============================================================
    console.log('\n⏳ 6. Kiểm tra và tạo schema bảo hành...');
    await migrateWarrantySchema(sequelize);

    console.log('\n⏳ 7. Kiểm tra và tạo schema Flash Sale...');
    await migrateFlashSaleSchema(sequelize);

    console.log('\n⏳ 8. Kiểm tra và tạo bảng thông báo...');
    await migrateNotificationSchema(sequelize);

    console.log('\n🎉 Hoàn thành cập nhật CSDL thành công! Toàn bộ dữ liệu hiện có được giữ nguyên 100%.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi thực hiện migration:', error);
    process.exit(1);
  }
}

runMigration();
