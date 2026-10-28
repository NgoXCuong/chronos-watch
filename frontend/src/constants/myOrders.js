import { ORDER_STATUS } from "./orderStatus";

/**
 * Cấu hình danh sách đơn hàng của khách. Khóa `sort` là token logic — phải khớp
 * map SORTS phía backend (`my-orders.service.js`); backend đã kẹp chiều trong token
 * nên trang này không có nút đổi chiều như danh sách bảo hành.
 */

export const MY_ORDER_PAGE_SIZE = 10;

export const MY_ORDER_DEFAULT_SORT = "newest";

export const MY_ORDER_SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "recent", label: "Vừa cập nhật" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "total_desc", label: "Giá trị: cao → thấp" },
  { value: "total_asc", label: "Giá trị: thấp → cao" },
];

/** Một giá trị, dẫn thẳng từ ORDER_STATUS để nhãn/chấm màu không lệch nhau. */
export const MY_ORDER_STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  ...Object.entries(ORDER_STATUS).map(([value, meta]) => ({
    value,
    label: meta.label,
    dot: meta.dot,
  })),
];

/** Đơn chưa giao thì khách còn tự hủy được (backend chặn lại nếu sai). */
export const CANCELABLE_STATUSES = ["pending", "confirmed"];

/** Phương thức cần khách tự báo đã chuyển khoản. */
export const TRANSFER_PAYMENT_METHODS = ["sepay", "banking"];

/** Đơn đã dừng: không còn tiến trình để theo dõi, chỉ còn lịch sử + lý do. */
export const CLOSED_STATUSES = ["cancelled", "returned"];

/** Lời dẫn cho khách ở từng mốc giao hàng (hiện dưới bước đang chạy). */
export const MY_ORDER_STEP_HINTS = {
  pending: "Đơn đã được ghi nhận, Chronos sẽ xác nhận trong ít giờ.",
  confirmed: "Đơn đã xác nhận — sản phẩm đang được lấy từ kho.",
  processing: "Sản phẩm đang được kiểm tra tình trạng và đóng gói.",
  shipping: "Đơn đã giao cho vận chuyển, đang trên đường tới bạn.",
  delivered: "Bạn đã nhận được hàng. Phiếu bảo hành bắt đầu có hiệu lực.",
};

/** Từ các trạng thái này đơn đã có phiếu bảo hành (kể cả phiếu bị hủy vì hoàn trả). */
export const WARRANTY_VISIBLE_STATUSES = ["delivered", "returned"];

/** Nhãn hiển thị cho dòng lịch sử chưa khớp trạng thái nào. */
export const ORDER_NOTE_FALLBACK = "Không ghi chú.";

/** Trạng thái thanh toán → nhãn + badge cho khách (đơn vẫn chưa paid thì khách còn phải trả). */
export const PAYMENT_STATUS_META = {
  paid: { label: "Đã thanh toán", badge: "success" },
  pending: { label: "Chờ thanh toán", badge: "warning" },
  unpaid: { label: "Chưa thanh toán", badge: "warning" },
  refunded: { label: "Đã hoàn tiền", badge: "info" },
  failed: { label: "Thanh toán lỗi", badge: "destructive-soft" },
};

export const paymentStatusMeta = (status) =>
  PAYMENT_STATUS_META[status] || { label: status || "Chưa rõ", badge: "muted" };
