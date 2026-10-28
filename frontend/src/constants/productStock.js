import { CheckCircle2, Clock, XCircle } from 'lucide-react';

/** Ngưỡng "sắp hết" — 5 chiếc, mức đủ thấp để cảnh báo thật chứ không dọa dẫm. */
export const LOW_STOCK_THRESHOLD = 5;

/** Trạng thái tồn kho suy ra từ số liệu, dùng chung chi tiết sản phẩm + thẻ sản phẩm. */
export const stockStatusOf = (stock) => {
    const n = Number(stock) || 0;
    if (n <= 0) return { key: 'out', label: 'Hết hàng', text: 'text-sale', badge: 'destructive-soft', icon: XCircle };
    if (n <= LOW_STOCK_THRESHOLD) return { key: 'low', label: `Chỉ còn ${n} chiếc`, text: 'text-warning', badge: 'warning', icon: Clock };
    return { key: 'in', label: 'Còn hàng', text: 'text-success', badge: 'success', icon: CheckCircle2 };
};
