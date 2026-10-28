import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import { formatDate, formatCompactVnd } from "../../../utils/formatCurrency";
import { toNumber, getUserDisplayName, getUserInitial } from "../../../utils/userManage";
import {
  USER_ROLE_BADGE,
  USER_STATUS_BADGE,
  USER_STATUS_DOT,
  roleLabel,
  statusLabel,
} from "../../../constants/userManage";

export const UserIdentityCell = ({ user, isSelf = false }) => {
  const name = getUserDisplayName(user);
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={name}
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
        />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-[12px] font-bold text-navy-700 dark:bg-navy-500/15 dark:text-navy-100">
          {getUserInitial(user)}
        </span>
      )}
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-card-foreground">
          {name}
          {isSelf && (
            <Badge variant="info" className="shrink-0 px-1.5 py-0">
              Bạn
            </Badge>
          )}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          @{user.username || "—"}
        </p>
      </div>
    </div>
  );
};

export const UserContactCell = ({ user }) => (
  <div className="min-w-0">
    <p className="truncate text-[12px] text-card-foreground">{user.email || "—"}</p>
    <p className="truncate text-[11px] text-muted-foreground tabular-nums">
      {user.phone || "Chưa có SĐT"}
    </p>
  </div>
);

export const UserRoleBadge = ({ role }) => (
  <Badge variant={USER_ROLE_BADGE[role] ?? "muted"}>{roleLabel(role)}</Badge>
);

export const UserStatusBadge = ({ status }) => (
  <Badge variant={USER_STATUS_BADGE[status] ?? "muted"}>
    <span
      className={cn("h-1.5 w-1.5 rounded-full", USER_STATUS_DOT[status] ?? "bg-muted-foreground")}
    />
    {statusLabel(status)}
  </Badge>
);

// order_count/total_spent là alias của subquery — backend trả về, chỉ việc hiển thị
export const UserOrdersCell = ({ user }) => (
  <span className="text-[13px] font-semibold text-card-foreground tabular-nums">
    {toNumber(user.order_count)}
    <span className="ml-1 text-[11px] font-normal text-muted-foreground">đơn</span>
  </span>
);

export const UserSpentCell = ({ user }) => {
  const amount = toNumber(user.total_spent);
  return (
    <span
      title={amount > 0 ? amount.toLocaleString("vi-VN") + " ₫" : "Chưa phát sinh đơn"}
      className={cn(
        "text-[13px] font-semibold tabular-nums",
        amount > 0 ? "text-navy-700 dark:text-navy-100" : "text-muted-foreground",
      )}
    >
      {amount > 0 ? formatCompactVnd(amount) : "—"}
    </span>
  );
};

export const UserJoinedCell = ({ user }) => (
  <span className="whitespace-nowrap text-[12px] text-muted-foreground tabular-nums">
    {formatDate(user.created_at)}
  </span>
);
