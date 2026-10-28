import {
  CheckCircle2,
  Clock,
  PackageCheck,
  RotateCcw,
  Settings2,
  Truck,
  XCircle,
} from "lucide-react";

// Nguồn duy nhất cho trạng thái đơn hàng: nhãn, badge, chấm màu, icon,
// và sơ đồ chuyển trạng thái được phép (Rule 3 — mọi bảng đơn dùng chung)
export const ORDER_STATUS = {
  pending: {
    label: "Chờ duyệt",
    badge: "warning",
    dot: "bg-warning",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    badge: "brand",
    dot: "bg-navy-500",
    icon: CheckCircle2,
  },
  processing: {
    label: "Đang xử lý",
    badge: "brand",
    dot: "bg-navy-700",
    icon: Settings2,
  },
  shipping: { label: "Đang giao", badge: "info", dot: "bg-info", icon: Truck },
  delivered: {
    label: "Hoàn thành",
    badge: "success",
    dot: "bg-success",
    icon: PackageCheck,
  },
  cancelled: {
    label: "Đã hủy",
    badge: "destructive-soft",
    dot: "bg-sale",
    icon: XCircle,
  },
  returned: {
    label: "Đã hoàn",
    badge: "muted",
    dot: "bg-navy-300",
    icon: RotateCcw,
  },
};

export const ORDER_STATUS_KEYS = Object.keys(ORDER_STATUS);

export const ORDER_STATUS_LABELS = ORDER_STATUS_KEYS.reduce((acc, key) => {
  acc[key] = ORDER_STATUS[key].label;
  return acc;
}, {});

export const ORDER_STATUS_BADGE = ORDER_STATUS_KEYS.reduce((acc, key) => {
  acc[key] = ORDER_STATUS[key].badge;
  return acc;
}, {});

// Trạng thái kế tiếp hợp lệ — backend cũng chặn theo sơ đồ này
export const ORDER_STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipping", "cancelled"],
  shipping: ["delivered"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

export const getNextStatuses = (status) =>
  ORDER_STATUS_TRANSITIONS[status] || [];

export const statusLabel = (status) => ORDER_STATUS[status]?.label ?? status;

// Dòng chảy tuyến tính cho stepper ở trang chi tiết (không gồm hủy/hoàn)
export const ORDER_STATUS_FLOW = [
  "pending",
  "confirmed",
  "processing",
  "shipping",
  "delivered",
];

// Nút "hành động tiếp theo" của trang chi tiết: trạng thái kế + nhãn + gợi ý
export const NEXT_STEP_ACTION = {
  pending: {
    status: "confirmed",
    label: "Chấp nhận đơn hàng",
    title: "Xác nhận tính hợp lệ của đơn hàng",
    hint: "Kiểm tra thông tin thanh toán và liên hệ khách hàng nếu cần thiết.",
  },
  confirmed: {
    status: "processing",
    label: "Bắt đầu xử lý kho",
    title: "Đưa đơn hàng vào quy trình xử lý",
    hint: "Chuyển trạng thái để bắt đầu việc lấy hàng và đóng gói tại kho.",
  },
  processing: {
    status: "shipping",
    label: "Giao cho vận chuyển",
    title: "Khởi tạo thông tin giao nhận",
    hint: "Đơn hàng đã sẵn sàng. Hãy bàn giao cho đơn vị vận chuyển.",
  },
  shipping: {
    status: "delivered",
    label: "Hoàn tất giao dịch",
    title: "Xác nhận khách đã nhận được hàng",
    hint: "Chỉ nhấn hoàn tất khi tiền đã thu (COD) hoặc hàng đã giao thành công.",
  },
};

// Phương thức thanh toán cần quản trị xác nhận thủ công
export const MANUAL_PAYMENT_METHODS = ["cod", "banking", "sepay"];

export const PAYMENT_METHOD_LABELS = {
  cod: "COD — thu khi giao",
  banking: "Chuyển khoản ngân hàng",
  sepay: "SePay",
  vnpay: "VNPay QR",
};

export const paymentMethodLabel = (method) =>
  PAYMENT_METHOD_LABELS[method] ?? (method || "Chưa chọn");

// Xác nhận thu tiền thủ công theo từng phương thức
export const COLLECT_PAYMENT_LABELS = {
  cod: "Đã thu tiền COD",
  banking: "Đã nhận chuyển khoản",
  sepay: "Đã nhận chuyển khoản",
};
