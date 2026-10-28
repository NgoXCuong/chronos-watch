import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NotificationItem from "./NotificationItem";
import { cn } from "@/lib/utils";

/**
 * Chuông thông báo dùng chung cho header khách và topbar admin.
 * `onSelect` nhận cả object thông báo để nơi gọi tự đánh dấu đã đọc + điều hướng.
 */
const NotificationBell = ({
  notifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onSelect,
  footer,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label="Thông báo"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          // overflow-visible: button gốc có overflow-hidden làm cắt badge đếm thông báo
          "relative h-10 w-10 overflow-visible rounded-full text-muted-foreground hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/15",
        )}
      >
        <Bell className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-card bg-sale px-1 text-[11px] font-bold text-white tabular-nums">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 overflow-hidden rounded-xl p-0 shadow-hover"
      >
        <div className="flex items-center justify-between border-b border-border bg-navy-50/60 px-4 py-3 dark:bg-navy-500/10">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-navy-800 dark:text-navy-100">
            Thông báo
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-[11px]"
              onClick={onMarkAllRead}
            >
              Đánh dấu đã đọc
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 dark:bg-navy-500/10">
                <Check className="h-6 w-6 text-success" strokeWidth={2} />
              </span>
              <p className="text-[13px] font-semibold text-foreground">
                Tất cả đều ổn
              </p>
              <p className="text-xs text-muted-foreground">
                Không có thông báo mới
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => {
                  setOpen(false);
                  onSelect?.(notification);
                }}
                className="items-start gap-3 rounded-none border-b border-border/60 p-3 last:border-b-0 focus:bg-navy-50 dark:focus:bg-navy-500/10"
              >
                <NotificationItem notification={notification} />
              </DropdownMenuItem>
            ))
          )}
        </div>

        {footer && (
          <Link
            to={footer.to}
            onClick={() => setOpen(false)}
            className="block border-t border-border py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-navy-700 transition-colors hover:bg-navy-50 dark:text-navy-100 dark:hover:bg-navy-500/10"
          >
            {footer.label}
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
