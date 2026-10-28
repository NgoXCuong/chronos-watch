import { UserCheck, UserPlus, UserX, Users } from "lucide-react";
import { buildMonthlySeries, computeTrend } from "./dashboardMetrics";
import { roleLabel, statusLabel } from "../constants/userManage";

// Số trả về từ SUM(DECIMAL) là chuỗi ("2063144200") — luôn ép kiểu trước khi tính
export const toNumber = (value) => Number(value) || 0;

export const getUserDisplayName = (user) =>
  user?.full_name?.trim() || user?.username || "—";

export const getUserInitial = (user) =>
  (getUserDisplayName(user).charAt(0) || "U").toUpperCase();

export const isSelfAccount = (user, currentUserId) =>
  !!currentUserId && String(user?.id) === String(currentUserId);

// Admin không được tự khóa/hạ quyền mình (backend cũng chặn — UI ẩn nút để khỏi bấm nhầm)
export const canBanAccount = (user, currentUserId) => !isSelfAccount(user, currentUserId);
export const canChangeRole = (user, currentUserId) => !isSelfAccount(user, currentUserId);
// Đổi mật khẩu của chính mình phải qua tab Bảo mật (cần mật khẩu cũ), không qua nút admin
export const canResetPassword = (user, currentUserId) => !isSelfAccount(user, currentUserId);

export const selectedWithoutSelf = (ids = [], currentUserId) =>
  ids.filter((id) => String(id) !== String(currentUserId));

// KPI trang thành viên — mọi số lấy từ GET /admin/users/stats (toàn hệ thống),
// không đếm trên 10 dòng đang hiển thị như bản cũ
export const buildUserStatCards = (stats) => {
  const num = (key) => toNumber(stats?.[key]);
  const total = num("total");
  const active = num("active_count");
  const banned = num("banned_count");
  const newThisMonth = num("new_this_month");
  const newLastMonth = num("new_last_month");
  const hist = buildMonthlySeries(stats?.growth_history, 6).map((p) => p.count);

  return [
    {
      label: "Tổng thành viên",
      value: total,
      icon: Users,
      hist,
      hint: `${num("admin_count")} tài khoản quản trị`,
      tone: "navy",
    },
    {
      label: "Thành viên mới tháng này",
      value: newThisMonth,
      icon: UserPlus,
      trend: computeTrend(newThisMonth, newLastMonth),
      hist,
      hint: `Tháng trước ${newLastMonth} thành viên mới`,
      tone: "violet",
    },
    {
      label: "Đang hoạt động",
      value: active,
      icon: UserCheck,
      hint: total > 0 ? `${Math.round((active / total) * 100)}% tổng tài khoản` : "Chưa có thành viên",
      tone: "teal",
    },
    {
      label: "Bị khóa",
      value: banned,
      icon: UserX,
      hint: banned > 0 ? "Không đăng nhập được cho tới khi mở khóa" : "Không có tài khoản bị khóa",
      tone: banned > 0 ? "sale" : "navy",
    },
  ];
};

// Dòng Excel trang thành viên — backend phải trả đủ cột (phone từng bị bỏ sót)
export const toUserExportRow = (user) => ({
  "Tên đăng nhập": user.username,
  Email: user.email,
  "Họ tên": user.full_name || "Chưa cập nhật",
  "Số điện thoại": user.phone || "Chưa cập nhật",
  "Vai trò": roleLabel(user.role),
  "Số đơn": toNumber(user.order_count),
  "Chi tiêu": toNumber(user.total_spent),
  "Ngày gia nhập": new Date(user.created_at).toLocaleDateString("vi-VN"),
  "Trạng thái": statusLabel(user.status),
});
