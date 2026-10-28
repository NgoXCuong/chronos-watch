// Trạng thái lịch hiển thị của banner — suy ra từ start_date/end_date (backend chỉ
// lưu 2 mốc, không có cột "schedule"), dùng cho badge và ô lọc trên /admin/banners.
// Giá trị trả về khớp SCHEDULE_FILTER_OPTIONS ở constants/bannerForm.js.
export const getBannerSchedule = (banner, now = new Date()) => {
  const start = banner?.start_date ? new Date(banner.start_date) : null;
  const end = banner?.end_date ? new Date(banner.end_date) : null;

  if (!start && !end)
    return { key: "running", label: "Vô thời hạn", variant: "success" };
  if (start && start > now)
    return { key: "upcoming", label: "Sắp chạy", variant: "info" };
  if (end && end < now)
    return { key: "expired", label: "Hết hạn", variant: "muted" };
  return { key: "running", label: "Đang chạy", variant: "success" };
};
