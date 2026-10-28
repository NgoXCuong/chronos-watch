import { PackageCheck, PackageX } from "lucide-react";

// Trạng thái sản phẩm — nguồn duy nhất cho badge/dropdown của trang quản lý
export const PRODUCT_STATUS = {
  active: {
    label: "Đang bán",
    badge: "success",
    dot: "bg-success",
    icon: PackageCheck,
  },
  inactive: {
    label: "Ngừng bán",
    badge: "muted",
    dot: "bg-navy-300",
    icon: PackageX,
  },
};

export const PRODUCT_STATUS_KEYS = Object.keys(PRODUCT_STATUS);

export const PRODUCT_STATUS_BADGE = Object.fromEntries(
  PRODUCT_STATUS_KEYS.map((key) => [key, PRODUCT_STATUS[key].badge]),
);

export const productStatusLabel = (status) =>
  PRODUCT_STATUS[status]?.label ?? status;

// Cảnh báo kho theo ngưỡng dùng chung (cell + dashboard)
export const LOW_STOCK_THRESHOLD = 5;
