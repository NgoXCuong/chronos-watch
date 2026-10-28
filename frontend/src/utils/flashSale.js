import { FLASH_SALE_STATE_BADGE } from '../constants/flashSale';

// UI không tự suy ra trạng thái: backend đã trả `state` cho cả danh sách admin lẫn
// /flash-sales/current (đồng hồ chuẩn là server_time, không phải giờ máy khách).
export const getFlashStateBadge = (state) =>
    FLASH_SALE_STATE_BADGE[state] ?? { label: '—', variant: 'muted' };

// Đợt tắt hoặc đã qua lịch không còn mua được → mờ dòng để không nhầm với đợt đang chạy
export const flashRowClass = (row) =>
    row?.state === 'inactive' || row?.state === 'expired' ? 'opacity-60' : '';

export const countdownParts = (ms) => {
    const total = Math.max(0, Math.floor(Number(ms) || 0));
    const hoursLeft = Math.floor(total / 3_600_000);
    return {
        total,
        days: Math.floor(hoursLeft / 24),
        hours: hoursLeft % 24,
        minutes: Math.floor((total / 60_000) % 60),
        seconds: Math.floor((total / 1000) % 60),
    };
};

export const padTwo = (n) => String(n).padStart(2, '0');

// Nhà đếm HH:MM:SS chỉ thân thiện trong vòng 1 ngày; xa hơn thì nói bằng ngày/giờ
export const formatTimeLeft = (ms) => {
    const { days, hours, minutes } = countdownParts(ms);
    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${padTwo(minutes)} phút`;
    return `${minutes} phút`;
};

// Suất đã bán / tổng suất — dùng cho thanh tiến trình "đã bán x/y"
export const flashSoldPercent = (item) => {
    const quota = Number(item?.quota) || 0;
    if (quota <= 0) return 0;
    return Math.min(100, Math.round(((Number(item?.sold_count) || 0) / quota) * 100));
};

// Map product_id → ưu đãi, để card/grid tra giá flash mà không lọc mảng mỗi lần render
export const indexFlashItemsByProduct = (items = []) =>
    items.reduce((acc, item) => {
        if (item?.product_id) acc[String(item.product_id)] = item;
        return acc;
    }, {});
