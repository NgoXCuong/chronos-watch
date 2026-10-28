// constants cho hai trang danh mục & thương hiệu — bám định nghĩa cột trong
// backend/src/models/category.model.js và brand.model.js
export const TAXONOMY_MAX = {
  name: 100, // categories.name / brands.name STRING(100) NOT NULL UNIQUE
  slug: 100, // STRING(100) NOT NULL UNIQUE
  country: 100, // brands.country STRING(100) nullable
};

// is_active đổi qua endpoint toggle-status riêng (không gửi trong FormData để
// tránh chuỗi "false" bị ép thành boolean đúng), nên form chỉ cần bộ lọc trạng thái.
export const VISIBILITY_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "true", label: "Đang hiển thị" },
  { value: "false", label: "Đang ẩn" },
];
