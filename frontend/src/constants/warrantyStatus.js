import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldOff,
  Wrench,
  XCircle,
} from "lucide-react";

// Nguồn duy nhất cho trạng thái PHIẾU bảo hành (Rule 3 — mọi bảng/card bảo hành dùng chung).
// 'expired' KHÔNG phải cột — backend suy ra từ end_date (utils/warranty.js) và trả về `state`.
// Badge variant theo Ink & Steel; teal/violet chỉ dùng cho khối số liệu, không cho CTA.
export const WARRANTY_STATE = {
  active: {
    label: "Còn hạn",
    badge: "success",
    dot: "bg-success",
    icon: ShieldCheck,
  },
  processing: {
    label: "Đang bảo hành",
    badge: "brand",
    dot: "bg-navy-500",
    icon: Wrench,
  },
  closed: {
    label: "Đã đóng",
    badge: "muted",
    dot: "bg-muted-foreground",
    icon: CheckCircle2,
  },
  expired: {
    label: "Hết hạn",
    badge: "warning",
    dot: "bg-warning",
    icon: Clock,
  },
  void: {
    label: "Vô hiệu",
    badge: "destructive-soft",
    dot: "bg-sale",
    icon: ShieldOff,
  },
};

const keys = Object.keys(WARRANTY_STATE);

export const WARRANTY_STATE_LABELS = keys.reduce((acc, k) => {
  acc[k] = WARRANTY_STATE[k].label;
  return acc;
}, {});

export const warrantyStateLabel = (state) => WARRANTY_STATE[state]?.label ?? state;

// state là giá trị SUY RA — enum status thật trong DB chỉ có 4 giá trị đầu
export const WARRANTY_STATUSES = ["active", "processing", "closed", "void"];

export const WARRANTY_STATE_FILTER_OPTIONS = [
  { value: "", label: "Mọi trạng thái" },
  ...keys.map((k) => ({ value: k, label: WARRANTY_STATE[k].label, dot: WARRANTY_STATE[k].dot })),
];

// Tùy chọn sort cột — khớp SORTABLE_WARRANTY_COLUMNS ở backend
export const WARRANTY_SORT_OPTIONS = [
  { value: "created_at", label: "Ngày tạo" },
  { value: "end_date", label: "Hết hạn" },
  { value: "start_date", label: "Ngày bắt đầu" },
  { value: "code", label: "Mã phiếu" },
  { value: "product_name", label: "Sản phẩm" },
];

// Yêu cầu bảo hành (warranty_requests) — dẫn xuất trạng thái + nhãn + badge
export const WARRANTY_REQUEST_STATUS = {
  pending: { label: "Chờ xử lý", badge: "warning", dot: "bg-warning", icon: Clock },
  processing: { label: "Đang xử lý", badge: "brand", dot: "bg-navy-500", icon: Wrench },
  done: { label: "Hoàn tất", badge: "success", dot: "bg-success", icon: CheckCircle2 },
  rejected: { label: "Từ chối", badge: "destructive-soft", dot: "bg-sale", icon: XCircle },
};

export const WARRANTY_REQUEST_STATUSES = Object.keys(WARRANTY_REQUEST_STATUS);

export const warrantyRequestLabel = (status) =>
  WARRANTY_REQUEST_STATUS[status]?.label ?? status;

export const WARRANTY_REQUEST_FILTER_OPTIONS = [
  { value: "", label: "Cần xử lý" },
  ...WARRANTY_REQUEST_STATUSES.map((k) => ({
    value: k,
    label: WARRANTY_REQUEST_STATUS[k].label,
    dot: WARRANTY_REQUEST_STATUS[k].dot,
  })),
];
