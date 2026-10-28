// Slug hóa tiếng Việt: bỏ dấu (NFD) + đ→d rồi mới thay ký tự lạ bằng gạch nối
export const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Định dạng slug hợp lệ (chữ thường, số, gạch nối) — dùng cho mọi cột slug UNIQUE
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
