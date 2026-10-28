import { useEffect, useState } from "react";
import { KeyRound, Lock, MapPin, ShieldCheck, ShoppingBag, Unlock, Wallet } from "lucide-react";
import adminApi from "../../../api/admin.api";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { DialogCloseButton } from "../../ui/dialog";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatDateTime } from "../../../utils/formatCurrency";
import { getUserDisplayName, getUserInitial, isSelfAccount, toNumber } from "../../../utils/userManage";
import { UserRoleBadge, UserStatusBadge } from "./UserCells";
import { ORDER_STATUS_BADGE, statusLabel } from "../../../constants/orderStatus";

const PANEL =
  "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-200";

const Field = ({ label, value, mono = false }) => (
  <div className="min-w-0">
    <p className="text-xs font-bold uppercase tracking-[0.02em] text-muted-foreground">
      {label}
    </p>
    <p className={cn("mt-0.5 truncate text-[13px] text-card-foreground", mono && "font-mono tabular-nums")}>
      {value || "Chưa cập nhật"}
    </p>
  </div>
);

const METRIC_ICON = "h-4 w-4 shrink-0 text-navy-600 dark:text-navy-200";

// Repo không cài eslint-plugin-react nên icon truyền theo component sẽ bị
// no-unused-vars — truyền sẵn phần tử JSX (xem vòng sửa OrderDetailPage)
const Metric = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
    {icon}
    <span className="min-w-0">
      <p className="truncate text-[11px] text-muted-foreground">{label}</p>
      <p className="text-[13px] font-bold text-navy-700 tabular-nums dark:text-navy-100">{value}</p>
    </span>
  </div>
);

const SectionTitle = ({ children }) => (
  <p className="mt-4 text-xs font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
    {children}
  </p>
);

// Thân panel mount theo key(userId) — mỗi lần mở một khách khác là state mới,
// không cần effect seed lại (rule react-hooks/set-state-in-effect)
const UserDetailBody = ({ userId, currentUserId, onClose, onToggleRole, onToggleStatus, onResetPassword }) => {
  const [state, setState] = useState({ loading: true, user: null, error: null });

  useEffect(() => {
    let alive = true;
    adminApi
      .getUserDetail(userId)
      .then((user) => alive && setState({ loading: false, user, error: null }))
      .catch(() => alive && setState({ loading: false, user: null, error: "Không tải được hồ sơ thành viên" }));
    return () => {
      alive = false;
    };
  }, [userId]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const user = state.user;
  const orders = user?.orders ?? [];
  const addresses = user?.addresses ?? [];

  return (
    <div className={PANEL}>
      <header className="flex items-start justify-between gap-3 border-b border-border bg-navy-50/60 px-5 py-4 dark:bg-navy-500/10">
        <div className="flex min-w-0 items-center gap-3">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover ring-1 ring-border" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-100 text-[15px] font-bold text-navy-700 dark:bg-navy-500/20 dark:text-navy-100">
              {getUserInitial(user ?? {})}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-[15px] font-extrabold text-navy-700 dark:text-navy-100">
              {state.loading ? "Đang tải hồ sơ..." : getUserDisplayName(user ?? {})}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              @{user?.username ?? "—"}
            </p>
          </div>
        </div>
        <DialogCloseButton onClick={onClose} />
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {state.error && (
          <p className="mt-4 rounded-lg bg-sale-soft px-3 py-2 text-[12px] font-semibold text-sale">
            {state.error}
          </p>
        )}

        {!state.loading && user && (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <UserRoleBadge role={user.role} />
              <UserStatusBadge status={user.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Email" value={user.email} />
              <Field label="Số điện thoại" value={user.phone} mono />
              <Field label="Gia nhập" value={formatDateTime(user.created_at)} />
              <Field label="Cập nhật gần nhất" value={formatDateTime(user.updated_at)} />
            </div>

            <SectionTitle>Hoạt động mua hàng</SectionTitle>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Metric icon={<ShoppingBag className={METRIC_ICON} strokeWidth={2} />} label="Đơn hợp lệ" value={`${toNumber(user.order_count)} đơn`} />
              <Metric icon={<Wallet className={METRIC_ICON} strokeWidth={2} />} label="Tổng chi tiêu" value={formatCurrency(toNumber(user.total_spent))} />
            </div>

            <SectionTitle>Địa chỉ nhận hàng</SectionTitle>
            {addresses.length === 0 ? (
              <p className="mt-2 text-[12px] text-muted-foreground">Chưa lưu địa chỉ nào.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {addresses.map((addr) => (
                  <li key={addr.id} className="rounded-lg border border-border px-3 py-2">
                    <p className="flex items-center gap-2 text-[12px] font-semibold text-card-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                      {addr.recipient_name}
                      <span className="text-muted-foreground tabular-nums">{addr.recipient_phone}</span>
                      {addr.is_default && <Badge variant="info">Mặc định</Badge>}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {[addr.address_line, addr.ward, addr.district, addr.city].filter(Boolean).join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <SectionTitle>Đơn gần đây</SectionTitle>
            {orders.length === 0 ? (
              <p className="mt-2 text-[12px] text-muted-foreground">Chưa đặt đơn nào.</p>
            ) : (
              <ul className="mt-2 divide-y divide-border">
                {orders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-2 py-2">
                    <span className="min-w-0">
                      <p className="truncate font-mono text-[12px] text-card-foreground tabular-nums">
                        {order.order_code || `#${order.id}`}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(order.created_at)}</p>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge variant={ORDER_STATUS_BADGE[order.status] ?? "muted"}>
                        {statusLabel(order.status)}
                      </Badge>
                      <span className="text-[12px] font-bold text-navy-700 tabular-nums dark:text-navy-100">
                        {formatCurrency(toNumber(order.total_amount))}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {!state.loading && user && (
        <footer className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-4">
          {isSelfAccount(user, currentUserId) ? (
            <p className="w-full text-center text-[11px] text-muted-foreground">
              Đây là tài khoản đang đăng nhập — muốn đổi mật khẩu hãy dùng tab Bảo mật
              (cần mật khẩu cũ), không tự đổi quyền hay khóa ở đây.
            </p>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResetPassword?.(user)}
                className="h-9 min-w-[120px] flex-1 gap-1.5 rounded-lg border-border text-[12px] font-semibold"
              >
                <KeyRound className="h-3.5 w-3.5" strokeWidth={2} />
                Đổi mật khẩu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleRole?.(user)}
                className="h-9 min-w-[120px] flex-1 gap-1.5 rounded-lg border-border text-[12px] font-semibold"
              >
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                {user.role === "admin" ? "Hạ xuống khách hàng" : "Gán quyền quản trị"}
              </Button>
              <Button
                variant={user.status === "banned" ? "default" : "destructive"}
                size="sm"
                onClick={() => onToggleStatus?.(user)}
                className="h-9 min-w-[120px] flex-1 gap-1.5 rounded-lg text-[12px] font-semibold"
              >
                {user.status === "banned" ? (
                  <Unlock className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                )}
                {user.status === "banned" ? "Mở khóa" : "Khóa tài khoản"}
              </Button>
            </>
          )}
        </footer>
      )}
    </div>
  );
};

// Panel hồ sơ khách hàng (drawer) — overlay z-150 như Dialog vì header admin sticky z-100
const UserDetailDrawer = ({ open, userId, currentUserId, onClose, onToggleRole, onToggleStatus, onResetPassword }) => {
  if (!open || !userId) return null;

  return (
    <div className="fixed inset-0 z-150">
      <div
        className="absolute inset-0 bg-navy-900/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <UserDetailBody
        key={`${userId}-${currentUserId ?? "anon"}`}
        userId={userId}
        currentUserId={currentUserId}
        onClose={onClose}
        onToggleRole={onToggleRole}
        onToggleStatus={onToggleStatus}
        onResetPassword={onResetPassword}
      />
    </div>
  );
};

export default UserDetailDrawer;
