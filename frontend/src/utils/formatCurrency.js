export const formatCurrency = (amt) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amt || 0);
};

// Số tiền rút gọn cho khu vực hẹp (KPI strip, trục tung biểu đồ)
export const formatCompactVnd = (amt) => {
  const n = Number(amt) || 0;
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)} tỷ`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)} tr`;
  if (Math.abs(n) >= 1e3) return `${Math.round(n / 1e3)}k`;
  return `${n}`;
};

// Ngày dd/MM/yyyy cho bảng admin (không giờ — giờ dùng formatRelativeTime)
export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

// Ngày + giờ cho trang chi tiết đơn hàng
export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// Số ngày/giờ tương đối cho bảng đơn gần đây
export const formatRelativeTime = (value) => {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.round(hours / 24)} ngày trước`;
};
