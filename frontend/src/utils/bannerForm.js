import {
  BANNER_DEFAULT_LINK,
  BANNER_MAX,
  BANNER_TITLE_ACCENT_PREFIX,
  BANNER_TITLE_SEPARATOR,
} from "../constants/bannerForm";

const SEPARATOR = ` ${BANNER_TITLE_SEPARATOR} `;

/**
 * Title banner lưu một dòng, HeroBanner tách theo "|" (dòng bắt đầu "!" = tô màu nhấn).
 * Quy ước này dùng chung giữa trang chủ và form ở /admin/banners nên đặt ở utils.
 */
export const parseBannerTitle = (title) => {
  const rawLines = (title || "")
    .split(BANNER_TITLE_SEPARATOR)
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    titleLines: rawLines.map((line) =>
      line.startsWith(BANNER_TITLE_ACCENT_PREFIX)
        ? line.slice(1).trim()
        : line,
    ),
    accentLines: rawLines.map((line) =>
      line.startsWith(BANNER_TITLE_ACCENT_PREFIX),
    ),
  };
};

// Gom khoảng trắng thừa quanh dấu "|" và bỏ dòng rỗng trước khi ghi DB
export const normalizeBannerTitle = (title) => {
  const parts = (title || "")
    .split(BANNER_TITLE_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.join(SEPARATOR);
};

// value của <input type="datetime-local"> là "2026-10-14T09:30" (giờ máy)
export const toLocalInput = (iso) => (iso ? new Date(iso).slice(0, 16) : "");

export const validateBanner = (form) => {
  const errors = {};
  const title = (form.title || "").trim();

  if (!title) errors.title = "Tiêu đề là bắt buộc.";
  else if (title.length > BANNER_MAX.title)
    errors.title = `Tối đa ${BANNER_MAX.title} ký tự.`;

  for (const key of ["eyebrow", "subtitle", "link_url"]) {
    if ((form[key] || "").length > BANNER_MAX[key])
      errors[key] = `Tối đa ${BANNER_MAX[key]} ký tự.`;
  }

  const order = Number(form.sort_order);
  if (!Number.isInteger(order) || order < 0 || order > 999999)
    errors.sort_order = "Thứ tự là số nguyên từ 0 đến 999999.";

  // datetime-local chỉ trả "" hoặc "YYYY-MM-DDThh:mm" hợp lệ nên không cần check NaN
  const start = form.start_date ? new Date(form.start_date) : null;
  const end = form.end_date ? new Date(form.end_date) : null;
  if (start && end && start >= end)
    errors.end_date = "Ngày kết thúc phải sau ngày bắt đầu.";

  return errors;
};

/**
 * FormData cho POST/PUT /banners — gửi đủ field kể cả rỗng để xóa mốc hẹn giờ trong DB.
 * is_active không nằm ở đây: đổi trạng thái qua PATCH /banners/:id/toggle-status.
 */
export const buildBannerPayload = (form, file) => {
  const fd = new FormData();
  fd.append("eyebrow", (form.eyebrow || "").trim());
  fd.append("title", normalizeBannerTitle(form.title));
  fd.append("subtitle", (form.subtitle || "").trim());
  fd.append("link_url", (form.link_url || "").trim() || BANNER_DEFAULT_LINK);
  fd.append("sort_order", Number(form.sort_order) || 0);
  fd.append("start_date", form.start_date || "");
  fd.append("end_date", form.end_date || "");
  if (file) fd.append("image", file);
  return fd;
};
