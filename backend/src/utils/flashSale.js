// Nghiệp vụ Flash Sale. "Đang chạy / sắp chạy / hết hạn / cháy hàng" KHÔNG phải cột
// trong DB — suy từ status + cửa sổ thời gian + suất đã bán, mỗi lần đọc tính lại
// với `now` (tiền lệ voucherStatus.js/bannerSchedule.js) để trạng thái không sai
// dần khi server chạy lâu.

export const FLASH_SALE_STATUSES = ['active', 'inactive'];

// Khóa trạng thái hiển thị, dùng chung cho badge + bộ lọc (frontend khớp tên khóa
// trong constants/flashSale.js, backend khớp trong admin-flash-sale.service.js)
export const FLASH_SALE_STATES = ['inactive', 'upcoming', 'running', 'sold_out', 'expired'];

// Số suất đã bán của một dòng (DECIMAL/ chuỗi từ MySQL → ép Number trước)
export const itemSold = (item) => Number(item?.sold_count) || 0;

// quota là cột NOT NULL nên không có nghĩa "NULL = vô hạn"; 0 = chưa cho bán.
export const itemRemaining = (item) => Math.max(0, (Number(item?.quota) || 0) - itemSold(item));

export const isItemSoldOut = (item) => item ? itemRemaining(item) <= 0 : false;

// % giảm so với giá niêm yết — làm tròn để UI và backend không lệch nhau 1%
export const flashDiscountPercent = (price, flashPrice) => {
    const list = Number(price);
    const flash = Number(flashPrice);
    if (!Number.isFinite(list) || list <= 0 || !Number.isFinite(flash) || flash <= 0) return 0;
    if (flash >= list) return 0;
    return Math.round(((list - flash) / list) * 100);
};

// Ưu tiên: tắt > chưa tới > đã kết thúc > bán hết suất > đang chạy
export const getFlashSaleState = (sale, now = new Date(), items = null) => {
    if (!sale) return null;
    if (sale.status !== 'active') return 'inactive';
    const time = new Date(now).getTime();
    if (sale.start_date && new Date(sale.start_date).getTime() > time) return 'upcoming';
    if (sale.end_date && new Date(sale.end_date).getTime() <= time) return 'expired';
    const list = items ?? sale.items;
    if (Array.isArray(list) && list.length > 0 && list.every(isItemSoldOut)) return 'sold_out';
    return 'running';
};

// % thời lượng đã trôi qua (0–100) cho thanh tiến trình "sắp kết thúc"
export const flashTimeProgress = (sale, now = new Date()) => {
    const start = new Date(sale?.start_date).getTime();
    const end = new Date(sale?.end_date).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
    const current = new Date(now).getTime();
    return Math.min(100, Math.max(0, Math.round(((current - start) / (end - start)) * 100)));
};
