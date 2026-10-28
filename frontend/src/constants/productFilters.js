// Cấu hình bộ lọc + sắp xếp cho trang /products.

export const PAGE_SIZE = 12; // lưới 3–4 cột nên 12 thay vì 9 của bản cũ

export const DEFAULT_SORT = "newest";

// Giá trị `sort` phải khớp LEGACY_SORTS/SORTABLE_PRODUCT_COLUMNS phía backend
// (product.service.js) — thêm khóa ở đây mà backend không hiểu là fallback về mới nhất.
export const SORT_OPTIONS = [
    { value: "newest", label: "Mới nhất" },
    { value: "sold_count", label: "Bán chạy nhất" },
    { value: "discount", label: "Giảm giá nhiều nhất" },
    { value: "price_asc", label: "Giá: thấp → cao" },
    { value: "price_desc", label: "Giá: cao → thấp" },
    { value: "popular", label: "Xem nhiều nhất" },
];

/**
 * Nhóm thông số đưa lên sidebar. `case_size` và `functions` bị loại vì dữ liệu thật
 * đang lưu chuỗi ghép ("Dạ quang, Lịch ngày, Giờ, phút, giây") và 13 cỡ mặt khác nhau
 * — lọc theo chúng chỉ tạo ra những lựa chọn trả 0 kết quả.
 */
export const SPEC_FILTER_GROUPS = [
    "movement",
    "glass",
    "water_resistance",
    "strap_material",
    "case_material",
    "dial_color",
];

export const MAX_SPEC_OPTIONS = 8;
