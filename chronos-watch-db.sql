CREATE DATABASE chronos_watch_db;
USE chronos_watch_db;

ALTER TABLE users ADD COLUMN reset_password_token VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN reset_password_expires DATETIME DEFAULT NULL;

-- ============================================================
-- 1. BẢNG users (Người dùng)
-- ============================================================
CREATE TABLE `users` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(50)  NOT NULL,
  `email`      VARCHAR(100) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `full_name`  VARCHAR(100) DEFAULT NULL,
  `phone`      VARCHAR(20)  DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `role`       ENUM('admin','customer') DEFAULT 'customer',
  `status`     ENUM('active','banned')          DEFAULT 'active',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`username`),
  UNIQUE KEY `unique_email`    (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. BẢNG user_addresses (Sổ địa chỉ người dùng)
-- ============================================================
CREATE TABLE `user_addresses` (
  `id`              INT          NOT NULL AUTO_INCREMENT,
  `user_id`         INT          NOT NULL,
  `recipient_name`  VARCHAR(100) NOT NULL,
  `recipient_phone` VARCHAR(20)  NOT NULL,
  `address_line`    VARCHAR(255) NOT NULL,
  `ward`            VARCHAR(100) DEFAULT NULL,
  `district`        VARCHAR(100) DEFAULT NULL,
  `city`            VARCHAR(100) NOT NULL,
  `is_default`      TINYINT(1)   DEFAULT 0,
  `created_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_address_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. BẢNG brands (Thương hiệu)
-- ============================================================
CREATE TABLE `brands` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL,
  `slug`        VARCHAR(100) NOT NULL,
  `description` TEXT         DEFAULT NULL,
  `logo_url`    VARCHAR(255) DEFAULT NULL,
  `country`     VARCHAR(100) DEFAULT NULL,
  `is_active`   TINYINT(1)   DEFAULT 1,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_brand_name` (`name`),
  UNIQUE KEY `unique_brand_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. BẢNG categories (Danh mục sản phẩm)
-- ============================================================
CREATE TABLE `categories` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL,
  `slug`        VARCHAR(100) NOT NULL,
  `description` TEXT         DEFAULT NULL,
  `parent_id`   INT          DEFAULT NULL,
  `sort_order`  INT          DEFAULT 0,
  `is_active`   TINYINT(1)   DEFAULT 1,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cat_name` (`name`),
  UNIQUE KEY `unique_cat_slug` (`slug`),
  CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. BẢNG products (Sản phẩm đồng hồ)
-- ============================================================
CREATE TABLE `products` (
  `id`             INT           NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(255)  NOT NULL,
  `slug`           VARCHAR(255)  NOT NULL,
  `description`    LONGTEXT      DEFAULT NULL COMMENT 'Hỗ trợ HTML cho mô tả chữ/ảnh xen kẽ',
  `price`          DECIMAL(15,0) NOT NULL COMMENT 'Giá VND không cần thập phân',
  `old_price`      DECIMAL(15,0) DEFAULT NULL,
  `stock`          INT           DEFAULT 0,
  `brand_id`       INT           NOT NULL,
  `image_url`      VARCHAR(255)  DEFAULT NULL,
`image_gallery`  JSON          DEFAULT NULL COMMENT 'Lưu danh sách ảnh các góc nhìn khác (JSON Array)',
  `specifications` JSON          DEFAULT NULL COMMENT 'Thông số (máy, kính, chống nước...) phục vụ AI',
  `views`          INT           DEFAULT 0,
  `sold_count`     INT           DEFAULT 0,
  `status`         ENUM('active','inactive') DEFAULT 'active',
  `created_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_product_slug` (`slug`),
  CONSTRAINT `fk_product_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_stock` CHECK (`stock` >= 0),
  CONSTRAINT `chk_price` CHECK (`price` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. BẢNG product_categories (Quan hệ Nhiều-Nhiều)
-- ============================================================
CREATE TABLE `product_categories` (
  `product_id`  INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`product_id`, `category_id`),
  CONSTRAINT `fk_pc_product`  FOREIGN KEY (`product_id`)  REFERENCES `products`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. BẢNG vouchers (Mã giảm giá)
-- ============================================================
CREATE TABLE `vouchers` (
  `id`                  INT           NOT NULL AUTO_INCREMENT,
  `code`                VARCHAR(50)   NOT NULL,
  `discount_type`       ENUM('fixed','percentage') DEFAULT 'fixed',
  `discount_value`      DECIMAL(15,0) NOT NULL,
  `max_discount`        DECIMAL(15,0) DEFAULT 0,
  `min_order_value`     DECIMAL(15,0) DEFAULT 0,
  `usage_limit`         INT           DEFAULT 100,
  `used_count`          INT           DEFAULT 0,
  `start_date`          DATETIME      NOT NULL,
  `end_date`            DATETIME      NOT NULL,
  `status`              ENUM('active','inactive') DEFAULT 'active',
  `created_at`          DATETIME      NOT NULL,
  `updated_at`          DATETIME      NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_voucher_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 8. BẢNG orders (Đơn hàng - Snapshot thông tin tại lúc mua)
-- ============================================================
CREATE TABLE `orders` (
  `id`              INT           NOT NULL AUTO_INCREMENT,
  `user_id`         INT           DEFAULT NULL,
  `full_name`       VARCHAR(100)  NOT NULL,
  `phone_number`    VARCHAR(20)   NOT NULL,
  `address_line`    TEXT          NOT NULL,
  `city`            VARCHAR(100)  NOT NULL,
  `subtotal`        DECIMAL(15,0) NOT NULL,
  `shipping_fee`    DECIMAL(15,0) DEFAULT 0,
  `discount_amount` DECIMAL(15,0) DEFAULT 0,
  `total_amount`    DECIMAL(15,0) NOT NULL,
  `voucher_id`      INT           DEFAULT NULL,
  `status`          ENUM('pending','confirmed','shipping','delivered','cancelled','returned') DEFAULT 'pending',
  `payment_method`  ENUM('cod','vnpay','banking') DEFAULT 'cod',
  `payment_status`  ENUM('unpaid','paid','refunded')     DEFAULT 'unpaid',
  `created_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_order_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. BẢNG order_details (Chi tiết sản phẩm trong đơn hàng)
-- ============================================================
CREATE TABLE `order_details` (
  `id`         INT           NOT NULL AUTO_INCREMENT,
  `order_id`   INT           NOT NULL,
  `product_id` INT           NOT NULL,
  `quantity`   INT           NOT NULL,
  `price`      DECIMAL(15,0) NOT NULL,
  `subtotal`   DECIMAL(15,0) GENERATED ALWAYS AS (`quantity` * `price`) STORED,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_od_order`   FOREIGN KEY (`order_id`)   REFERENCES `orders`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_od_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. BẢNG order_history (Theo dõi hành trình đơn hàng)
-- ============================================================
CREATE TABLE `order_history` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `order_id`    INT          NOT NULL,
  `status`      VARCHAR(50)  NOT NULL,
  `note`        TEXT,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_history_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. CÁC BẢNG PHỤ (Carts, Reviews, Wishlists, Banners)
-- ============================================================
CREATE TABLE `carts` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `user_id`    INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity`   INT DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart` (`user_id`, `product_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `wishlists` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `user_id`    INT NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wishlist` (`user_id`, `product_id`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `reviews` (
  `id`          INT        NOT NULL AUTO_INCREMENT,
  `user_id`     INT        NOT NULL,
  `product_id`  INT        NOT NULL,
  `rating`      TINYINT    NOT NULL,
  `comment`     TEXT,
  `created_at`  TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_rating`  CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `banners` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(255) DEFAULT NULL,
  `image_url`   VARCHAR(255) NOT NULL,
  `link_url`    VARCHAR(255) DEFAULT NULL,
  `position`    ENUM('home_main', 'home_sidebar', 'popup') DEFAULT 'home_main',
  `sort_order`  INT          DEFAULT 0,
  `is_active`   TINYINT(1)   DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 12. TRIGGERS (Tự động hóa kho & Lịch sử)
-- ============================================================
DELIMITER $$

-- Trừ kho khi bán hàng
CREATE TRIGGER `tr_after_order_detail_insert`
AFTER INSERT ON `order_details`
FOR EACH ROW
BEGIN
    UPDATE `products`
    SET `stock` = `stock` - NEW.quantity,
        `sold_count` = `sold_count` + NEW.quantity
    WHERE `id` = NEW.product_id;
END$$

-- Hoàn kho khi Hủy/Trả hàng & Ghi lịch sử đơn
CREATE TRIGGER `tr_after_order_status_update`
AFTER UPDATE ON `orders`
FOR EACH ROW
BEGIN
    -- Hoàn kho
    IF (NEW.status IN ('cancelled', 'returned')) AND (OLD.status NOT IN ('cancelled', 'returned')) THEN
        UPDATE `products` p
        JOIN `order_details` od ON p.id = od.product_id
        SET p.stock = p.stock + od.quantity,
            p.sold_count = p.sold_count - od.quantity
        WHERE od.order_id = NEW.id;

        IF NEW.voucher_id IS NOT NULL THEN
            UPDATE `vouchers` SET `usage_count` = `usage_count` - 1 WHERE `id` = NEW.voucher_id;
        END IF;
    END IF;
    
    -- Ghi lịch sử mỗi khi chuyển trạng thái
    IF NEW.status <> OLD.status THEN
        INSERT INTO `order_history` (order_id, status, note) 
        VALUES (NEW.id, NEW.status, CONCAT('Trạng thái cập nhật: ', NEW.status));
    END IF;
END$$

DELIMITER ;