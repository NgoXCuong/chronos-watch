import { Bell, Heart, Lock, MapPin, ShieldCheck, ShoppingBag, User } from "lucide-react";

/**
 * Menu cụm tài khoản khách — một nguồn cho mọi trang (hồ sơ, địa chỉ, đơn, yêu thích,
 * bảo hành). `hash` dùng cho các trang nhiều tab: mục đang mở phải sáng đúng tab.
 */
export const ACCOUNT_LINKS = [
  { to: "/profile", hash: "", label: "Hồ sơ cá nhân", icon: User },
  { to: "/profile", hash: "#addresses", label: "Sổ địa chỉ", icon: MapPin },
  { to: "/profile", hash: "#security", label: "Bảo mật", icon: Lock },
  { to: "/orders", hash: "", label: "Đơn hàng của tôi", icon: ShoppingBag },
  { to: "/wishlist", hash: "", label: "Sản phẩm yêu thích", icon: Heart },
  { to: "/warranties", hash: "", label: "Phiếu bảo hành", icon: ShieldCheck },
  { to: "/notifications", hash: "", label: "Thông báo", icon: Bell },
];

/**
 * Ba tab của /profile — đơn hàng và yêu thích KHÔNG còn ở đây nữa (trang riêng thắng,
 * xem ACCOUNT_LINKS) để một thông tin chỉ có một đường vào.
 */
export const PROFILE_TABS = {
  "": { title: "Hồ sơ cá nhân", subtitle: "Thông tin Chronos dùng để liên hệ và giao hàng cho bạn." },
  "#addresses": { title: "Sổ địa chỉ", subtitle: "Lưu sẵn các địa chỉ nhận hàng để đặt đơn nhanh hơn." },
  "#security": { title: "Bảo mật", subtitle: "Đổi mật khẩu đăng nhập tài khoản của bạn." },
};

export const profileTabMeta = (hash) => PROFILE_TABS[hash] || PROFILE_TABS[""];
