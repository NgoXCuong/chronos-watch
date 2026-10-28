import {
  LayoutDashboard,
  ClipboardList,
  Box,
  FolderTree,
  Diamond,
  Image as ImageIcon,
  Ticket,
  Star,
  Users,
  ShieldCheck,
  Zap,
  Bell,
} from "lucide-react";

// Cấu trúc menu admin — dùng chung cho Sidebar và breadcrumb Topbar
export const ADMIN_MENU_SECTIONS = [
  {
    title: "Tổng quan",
    items: [{ path: "/admin", icon: LayoutDashboard, label: "Dashboard" }],
  },
  {
    title: "Bán hàng",
    items: [
      { path: "/admin/orders", icon: ClipboardList, label: "Đơn hàng", badge: "order" },
      { path: "/admin/products", icon: Box, label: "Sản phẩm" },
      { path: "/admin/warranties", icon: ShieldCheck, label: "Bảo hành" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { path: "/admin/categories", icon: FolderTree, label: "Danh mục" },
      { path: "/admin/brands", icon: Diamond, label: "Thương hiệu" },
      { path: "/admin/banners", icon: ImageIcon, label: "Banner" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { path: "/admin/vouchers", icon: Ticket, label: "Voucher" },
      { path: "/admin/flash-sales", icon: Zap, label: "Flash Sale" },
      { path: "/admin/reviews", icon: Star, label: "Đánh giá" },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { path: "/admin/users", icon: Users, label: "Người dùng" },
      { path: "/admin/notifications", icon: Bell, label: "Thông báo" },
    ],
  },
];

export const ADMIN_MENU_ITEMS = ADMIN_MENU_SECTIONS.flatMap((s) => s.items);

const matchesPath = (itemPath, pathname) =>
  itemPath === "/admin"
    ? pathname === "/admin" || pathname === "/admin/"
    : pathname.startsWith(itemPath);

export const findActiveMenuItem = (pathname) =>
  ADMIN_MENU_ITEMS.find((i) => matchesPath(i.path, pathname));

// Nhãn trang con (chi tiết đơn, sửa sản phẩm…) — ưu tiên khớp dài nhất
const ADMIN_SUBTITLE_PATTERNS = [
  [/^\/admin\/orders\/[^/]+$/, "Chi tiết đơn hàng"],
  [/^\/admin\/products\/[^/]+$/, "Chỉnh sửa sản phẩm"],
];

export const getAdminPageTitle = (pathname) =>
  ADMIN_SUBTITLE_PATTERNS.find(([re]) => re.test(pathname))?.[1] ??
  findActiveMenuItem(pathname)?.label ??
  "Quản trị";
