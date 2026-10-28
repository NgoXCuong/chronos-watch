// Constants cho trang quản banner — bám backend/src/models/banner.model.js
// (eyebrow STRING(100) · title STRING(255) NOT NULL · subtitle STRING(500) ·
//  image_url STRING(500) NOT NULL · link_url STRING(255) · sort_order INT ·
//  start_date/end_date DATETIME nullable)
export const BANNER_MAX = {
  eyebrow: 100,
  title: 255,
  subtitle: 500,
  link_url: 255,
};

export const BANNER_DEFAULT_LINK = "/products";

// HeroBanner tách title theo "|" và tô màu nhấn dòng bắt đầu bằng "!"
export const BANNER_TITLE_SEPARATOR = "|";
export const BANNER_TITLE_ACCENT_PREFIX = "!";

// is_active đổi qua PATCH /banners/:id/toggle-status (không gửi trong FormData
// vì giá trị "false" dạng chuỗi dễ bị ép sai khi lên BOOLEAN), nên form chỉ cần bộ lọc.
export const VISIBILITY_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "true", label: "Đang bật" },
  { value: "false", label: "Đang tắt" },
];

// Lọc theo khoảng hẹn giờ — khớp SCHEDULE_FILTERS trong backend/src/services/banner.service.js
// và getBannerSchedule() trong utils/bannerSchedule.js (cùng chữ dùng cho badge)
export const SCHEDULE_FILTER_OPTIONS = [
  { value: "", label: "Mọi lịch hiển thị" },
  { value: "running", label: "Đang chạy", dot: "bg-success" },
  { value: "upcoming", label: "Sắp chạy", dot: "bg-info" },
  { value: "expired", label: "Hết hạn", dot: "bg-muted-foreground" },
];
