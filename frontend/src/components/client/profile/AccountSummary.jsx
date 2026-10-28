import { User } from "lucide-react";

const initialsOf = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

/** Thẻ nhỏ góc phải header trang hồ sơ: ai đang đăng nhập, email nào. */
const AccountSummary = ({ user }) => (
  <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-card">
    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-navy-200 bg-navy-50 text-[13px] font-bold text-navy-700 dark:border-navy-500/30 dark:bg-navy-500/15">
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt="" className="size-full object-cover" />
      ) : (
        initialsOf(user?.full_name || user?.username) || (
          <User size={16} strokeWidth={2} aria-hidden="true" />
        )
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate text-[13px] font-bold text-foreground">
        {user?.full_name || user?.username || "Tài khoản của bạn"}
      </p>
      <p className="truncate text-[12px] text-muted-foreground">
        {user?.email || user?.phone_number || "Chronos Member"}
      </p>
    </div>
  </div>
);

export default AccountSummary;
