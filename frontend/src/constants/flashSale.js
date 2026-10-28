// Constants cho Flash Sale — khóa/bộ lọc phải khớp backend:
//   state suy ra:    backend/src/utils/flashSale.js (getFlashSaleState)
//   bộ lọc lịch:     STATE_FILTERS trong backend/src/services/admin-flash-sale.service.js
//   cột sort:        SORTABLE_FLASH_COLUMNS (cùng file)
//   ràng buộc cột:   backend/src/migrations/flashSale.schema.js
//   nạp danh sách SP: backend/src/services/flash-sale-item.service.js

export const FLASH_SALE_MAX = {
    name: 120,
    description: 2000,
};

// flash_price là DECIMAL(15,0) — không có giá trị thập phân
export const FLASH_PRICE_STEP = 1000;

export const FLASH_ITEM_DEFAULTS = {
    quota: 10,
    per_user_limit: 1,
};

// Trạng thái SUY RA (không có cột nào trong DB) — badge dùng variant sẵn có của ui/badge
export const FLASH_SALE_STATE_BADGE = {
    running: { label: 'Đang chạy', variant: 'success', dot: 'bg-success' },
    upcoming: { label: 'Sắp chạy', variant: 'info', dot: 'bg-info' },
    sold_out: { label: 'Cháy hàng', variant: 'warning', dot: 'bg-warning' },
    expired: { label: 'Hết hạn', variant: 'muted', dot: 'bg-muted-foreground' },
    inactive: { label: 'Đang tắt', variant: 'muted', dot: 'bg-muted-foreground' },
};

// value gửi lên ?state= — khớp đúng khóa trong STATE_FILTERS
export const STATE_FILTER_OPTIONS = [
    { value: '', label: 'Mọi trạng thái' },
    { value: 'running', label: 'Đang chạy', dot: 'bg-success' },
    { value: 'upcoming', label: 'Sắp chạy', dot: 'bg-info' },
    { value: 'expired', label: 'Hết hạn', dot: 'bg-muted-foreground' },
    { value: 'inactive', label: 'Đang tắt', dot: 'bg-muted-foreground' },
];

// status là cột ENUM thật — nút ⏻ trên dòng đổi qua PATCH /admin/flash-sales/:id/status
export const STATUS_FILTER_OPTIONS = [
    { value: '', label: 'Mọi cấu hình' },
    { value: 'active', label: 'Đang bật', dot: 'bg-success' },
    { value: 'inactive', label: 'Đang tắt', dot: 'bg-muted-foreground' },
];

export const FLASH_SALE_STATUS_LABEL = {
    active: 'Đang bật',
    inactive: 'Đang tắt',
};

// Ô chọn sản phẩm trong form: trang thái ngừng bán bị backend chặn đưa vào đợt
export const FLASH_PRODUCT_PAGE_SIZE = 20;
