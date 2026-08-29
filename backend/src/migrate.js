import sequelize from './config/db.js';

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
        \`user_id\`    INT       NOT NULL,
        \`order_id\`   INT       DEFAULT NULL,
        \`used_at\`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
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

    console.log('\n🎉 Hoàn thành cập nhật CSDL thành công! Toàn bộ dữ liệu hiện có được giữ nguyên 100%.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi thực hiện migration:', error);
    process.exit(1);
  }
}

runMigration();
