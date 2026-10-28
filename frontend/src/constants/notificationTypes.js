import {
  Bell,
  ClipboardList,
  CreditCard,
  PackageSearch,
  ShieldCheck,
  Star,
} from "lucide-react";

// type trong bảng notifications → icon hiển thị (một nguồn cho chuông + trang /notifications).
export const NOTIFICATION_ICON = {
  order: ClipboardList,
  payment: CreditCard,
  stock: PackageSearch,
  review: Star,
  warranty: ShieldCheck,
  system: Bell,
};

// Nhãn tiếng Việt dùng cho bộ lọc + badge ở trang admin.
export const NOTIFICATION_TYPE_LABEL = {
  order: "Đơn hàng",
  payment: "Thanh toán",
  stock: "Tồn kho",
  review: "Đánh giá",
  warranty: "Bảo hành",
  system: "Hệ thống",
};

export const NOTIFICATION_TYPE_FILTER_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  ...Object.entries(NOTIFICATION_TYPE_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
];

export const NOTIFICATION_READ_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "unread", label: "Chưa đọc" },
  { value: "read", label: "Đã đọc" },
];
