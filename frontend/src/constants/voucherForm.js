// Constants cho trang quản voucher — bám backend/src/models/voucher.model.js
// (code STRING(50) unique NOT NULL · discount_type ENUM('percentage','fixed') NOT NULL ·
//  discount_value DECIMAL(15,0) NOT NULL · max_discount/min_order_value DECIMAL(15,0) nullable ·
//  start_date/end_date DATE NOT NULL · usage_limit/per_user_limit INT nullable ·
//  used_count INT · status ENUM('active','inactive'))
export const VOUCHER_MAX = {
  code: 50,
};

// Mã voucher hiện ra ở ô nhập khuyến mãi của khách nên chỉ dùng ký tự an toàn
export const VOUCHER_CODE_PATTERN = /^[A-Z0-9_-]+$/;

export const DISCOUNT_TYPE_OPTIONS = [
  { value: "percentage", label: "Phần trăm (%)" },
  { value: "fixed", label: "Số tiền cố định (VND)" },
];

export const TYPE_FILTER_OPTIONS = [
  { value: "", label: "Mọi loại giảm" },
  { value: "percentage", label: "Phần trăm" },
  { value: "fixed", label: "Số tiền cố định" },
];

// status là cột thật trong DB — nút ⏻ trên dòng đổi qua PATCH /vouchers/:id/status
export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Mọi trạng thái" },
  { value: "active", label: "Đang bật", dot: "bg-success" },
  { value: "inactive", label: "Đang tắt", dot: "bg-muted-foreground" },
];

// Lọc theo cửa sổ hiệu lực — khớp WINDOW_FILTERS trong backend/src/services/voucher.service.js
export const WINDOW_FILTER_OPTIONS = [
  { value: "", label: "Mọi thời điểm" },
  { value: "running", label: "Đang chạy", dot: "bg-success" },
  { value: "upcoming", label: "Sắp chạy", dot: "bg-info" },
  { value: "expired", label: "Hết hạn", dot: "bg-muted-foreground" },
];
