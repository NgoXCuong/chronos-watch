// "09:42 · 28/10/2026" — cùng định dạng cho dropdown header và trang thông báo.
export const formatNotificationTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} · ${date.toLocaleDateString("vi-VN")}`;
};

// Trang danh sách thông báo sửa trạng thái đọc → phát sự kiện để chuông trên
// header/topbar tải lại ngay, không phải chờ nhịp poll 60s.
export const NOTIFICATIONS_CHANGED = "chronos:notifications-changed";

export const emitNotificationsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
  }
};
