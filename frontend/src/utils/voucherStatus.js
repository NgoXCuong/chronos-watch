// Trạng thái voucher suy ra từ status + cửa sổ hiệu lực + lượt đã dùng (backend không lưu
// cột "trạng thái" dẫn xuất nào khác). key/label/variant khớp WINDOW_FILTER_OPTIONS +
// STATUS_FILTER_OPTIONS ở constants/voucherForm.js và bộ lọc window/status trong
// backend/src/services/voucher.service.js.
// end_date so trực tiếp với now (như validateVoucher lúc checkout) nên mã hết hạn
// ngay từ 00:00 ngày kết thúc — badge phải nói đúng điều đó.
export const isVoucherExhausted = (voucher) => {
  const raw = voucher?.usage_limit;
  // NULL/undefined = không giới hạn; Number(null) ra 0 nên phải chặn trước khi ép kiểu
  if (raw === null || raw === undefined || raw === "") return false;
  const limit = Number(raw);
  if (!Number.isFinite(limit)) return false;
  return Number(voucher?.used_count || 0) >= limit;
};

export const getVoucherStatus = (voucher, now = new Date()) => {
  if (!voucher) return { key: "inactive", label: "—", variant: "muted" };
  if (voucher.status === "inactive")
    return { key: "inactive", label: "Đang tắt", variant: "muted" };
  if (voucher.start_date && new Date(voucher.start_date) > now)
    return { key: "upcoming", label: "Sắp chạy", variant: "info" };
  if (voucher.end_date && new Date(voucher.end_date) < now)
    return { key: "expired", label: "Hết hạn", variant: "muted" };
  if (isVoucherExhausted(voucher))
    return { key: "exhausted", label: "Hết lượt", variant: "warning" };
  return { key: "running", label: "Đang chạy", variant: "success" };
};

// Mã không dùng được ngay (đang tắt / hết hạn) → mờ dòng để không nhầm với mã đang chạy
export const voucherRowClass = (voucher, now = new Date()) => {
  const key = getVoucherStatus(voucher, now).key;
  return key === "inactive" || key === "expired" ? "opacity-60" : "";
};
