// Giới hạn + tùy chọn của form sản phẩm, bám đúng định nghĩa cột trong
// backend/src/models/product.model.js và multer limits ở upload.middleware.js

export const FIELD_MAX = {
  name: 255, // products.name STRING(255) NOT NULL
  slug: 255, // products.slug STRING(255) NOT NULL UNIQUE
  sku: 50, // products.sku STRING(50) UNIQUE (nullable)
  warranty: 120, // products.warranty_months INTEGER
};

// products.status ENUM('active','inactive')
export const PRODUCT_STATUS_OPTIONS = [
  { value: "active", label: "Đang bán", dot: "bg-success" },
  { value: "inactive", label: "Ngừng bán", dot: "bg-navy-300" },
];

export const WARRANTY_PRESETS = [3, 6, 12, 24, 36, 60];

// Giới hạn upload ảnh đặt ở constants/upload.js (dùng chung với danh mục/thương hiệu)
export const LOW_STOCK_ALERT = 10;

export const SPEC_CUSTOM = "__custom__";
