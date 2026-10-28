// Nhãn/badge và bộ lọc cho trang Quản lý thành viên — bám đúng ENUM trong
// backend/src/models/user.model.js (role: admin|customer, status: active|banned).
export const USER_ROLE_LABELS = {
  admin: "Quản trị viên",
  customer: "Khách hàng",
};

export const USER_ROLE_BADGE = {
  admin: "brand",
  customer: "muted",
};

export const USER_STATUS_LABELS = {
  active: "Đang hoạt động",
  banned: "Đã khóa",
};

export const USER_STATUS_BADGE = {
  active: "success",
  banned: "destructive-soft",
};

export const USER_STATUS_DOT = {
  active: "bg-success",
  banned: "bg-sale",
};

export const roleLabel = (role) => USER_ROLE_LABELS[role] ?? role ?? "—";
export const statusLabel = (status) => USER_STATUS_LABELS[status] ?? status ?? "—";

export const USER_ROLE_FILTER_OPTIONS = [
  { value: "", label: "Tất cả vai trò" },
  { value: "customer", label: "Khách hàng" },
  { value: "admin", label: "Quản trị viên" },
];

export const USER_STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động", dot: "bg-success" },
  { value: "banned", label: "Đã khóa", dot: "bg-sale" },
];
