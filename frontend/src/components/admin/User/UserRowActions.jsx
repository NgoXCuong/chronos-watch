import { Eye, KeyRound, Lock, ShieldCheck, Unlock, UserCog } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { canBanAccount, canChangeRole, canResetPassword } from "../../../utils/userManage";

const ICON = "h-8 w-8 rounded-lg text-muted-foreground";
const NEUTRAL =
  "hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15 dark:hover:text-navy-100";

/**
 * Hành động trên một dòng thành viên: xem hồ sơ, đặt lại mật khẩu, đổi vai trò,
 * khóa/mở khóa. Nút bị ẩn với chính tài khoản đang đăng nhập (backend cũng chặn —
 * xem admin-user.service.js) để admin không tự khóa hay tự đổi mật khẩu giữa phiên.
 */
export const UserRowActions = ({
  user,
  currentUserId,
  busyId,
  onView,
  onToggleRole,
  onToggleStatus,
  onResetPassword,
}) => {
  const busy = busyId === user.id;
  const showRole = canChangeRole(user, currentUserId);
  const showStatus = canBanAccount(user, currentUserId);
  const showPassword = canResetPassword(user, currentUserId);
  const isBanned = user.status === "banned";
  const isAdmin = user.role === "admin";

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Xem hồ sơ ${user.username}`}
        onClick={() => onView?.(user)}
        className={cn(ICON, NEUTRAL)}
      >
        <Eye className="h-4 w-4" strokeWidth={2} />
      </Button>

      {showPassword && (
        <Button
          variant="ghost"
          size="icon"
          disabled={busy}
          aria-label={`Đặt lại mật khẩu ${user.username}`}
          title="Đặt mật khẩu mới cho khách"
          onClick={() => onResetPassword?.(user)}
          className={cn(ICON, NEUTRAL)}
        >
          <KeyRound className="h-4 w-4" strokeWidth={2} />
        </Button>
      )}

      {showRole && (
        <Button
          variant="ghost"
          size="icon"
          disabled={busy}
          aria-label={isAdmin ? `Hạ quyền ${user.username}` : `Thăng ${user.username} lên quản trị`}
          title={isAdmin ? "Chuyển về khách hàng" : "Gán quyền quản trị"}
          onClick={() => onToggleRole?.(user)}
          className={cn(
            ICON,
            isAdmin ? "text-navy-600 hover:bg-navy-50 hover:text-navy-700 dark:text-navy-200" : NEUTRAL,
          )}
        >
          {isAdmin ? (
            <UserCog className="h-4 w-4" strokeWidth={2} />
          ) : (
            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
          )}
        </Button>
      )}

      {showStatus && (
        <Button
          variant="ghost"
          size="icon"
          disabled={busy}
          aria-label={isBanned ? `Mở khóa ${user.username}` : `Khóa ${user.username}`}
          title={
            isBanned
              ? "Cho phép đăng nhập lại"
              : "Khóa tài khoản, khách không đăng nhập được"
          }
          onClick={() => onToggleStatus?.(user)}
          className={cn(
            ICON,
            isBanned
              ? NEUTRAL
              : "hover:bg-sale-soft hover:text-sale dark:hover:bg-sale/15",
          )}
        >
          {isBanned ? (
            <Unlock className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Lock className="h-4 w-4" strokeWidth={2} />
          )}
        </Button>
      )}

      {!showRole && !showStatus && !showPassword && (
        <span className="pr-2 text-[11px] text-muted-foreground">
          <Lock className="inline h-3 w-3" aria-hidden="true" /> tài khoản của bạn
        </span>
      )}
    </div>
  );
};
