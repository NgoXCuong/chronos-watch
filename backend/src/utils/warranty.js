// Nghiệp vụ ngày tháng của bảo hành. "Hết hạn" KHÔNG phải cột trong DB — suy từ
// end_date mỗi lần đọc, giống bannerSchedule.js/voucherStatus.js, để trạng thái
// không sai dần theo thời gian server chạy lâu.

export const WARRANTY_STATUSES = ['active', 'processing', 'closed', 'void'];
export const WARRANTY_REQUEST_STATUSES = ['pending', 'processing', 'done', 'rejected'];

// Không dùng date.setMonth(): JS tự tràn ngày (31/01 + 1 tháng → 02/03, lệch 2 ngày).
// Ở đây giữ ngày trong phạm vi tháng đích (31/01 + 1 tháng → 28/02).
export const addMonths = (date, months) => {
    const start = new Date(date);
    const day = start.getDate();
    start.setDate(1);
    start.setMonth(start.getMonth() + Number(months));
    const daysInTarget = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    start.setDate(Math.min(day, daysInTarget));
    return start;
};

export const warrantyEndDate = (startDate, months) => addMonths(startDate, months);

// Khóa trạng thái hiển thị: void > processing > closed > (expired | active)
export const getWarrantyState = (warranty, now = new Date()) => {
    if (!warranty) return null;
    if (warranty.status === 'void') return 'void';
    if (warranty.status === 'processing') return 'processing';
    if (warranty.status === 'closed') return 'closed';
    const end = new Date(warranty.end_date);
    return end.getTime() <= new Date(now).getTime() ? 'expired' : 'active';
};

// Phần trăm thời hạn đã dùng + số ngày còn lại (âm → 0) cho thanh tiến trình UI.
export const warrantyProgress = (warranty, now = new Date()) => {
    if (!warranty?.start_date || !warranty?.end_date) return null;
    const start = new Date(warranty.start_date).getTime();
    const end = new Date(warranty.end_date).getTime();
    const current = new Date(now).getTime();
    const totalDays = Math.max(1, Math.round((end - start) / 86_400_000));
    const leftDays = Math.round((end - current) / 86_400_000);
    const used = Math.min(100, Math.max(0, Math.round(((current - start) / (end - start)) * 100)));
    return { totalDays, leftDays, usedPercent: Number.isNaN(used) ? 100 : used };
};

// Mã phiếu gắn với mã đơn để đối chiếu thủ công: CHR-251013-AB12CD → ...-W01
export const buildWarrantyCode = (orderCode, seq) =>
    `${orderCode || 'ORDER'}-W${String(seq).padStart(2, '0')}`;
