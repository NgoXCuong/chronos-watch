import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTIFICATION_ICON } from "@/constants/notificationTypes";
import { formatNotificationTime } from "@/utils/notifications";

// Nội dung một thông báo — dùng chung cho dropdown trên header và trang /notifications.
const NotificationItem = ({ notification, className }) => {
  const Icon = NOTIFICATION_ICON[notification?.type] ?? Bell;
  const unread = !notification?.read_at;

  return (
    <span className={cn("flex w-full items-start gap-3", className)}>
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-100">
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate text-[13px] leading-tight",
              unread
                ? "font-bold text-foreground"
                : "font-semibold text-foreground/75",
            )}
          >
            {notification?.title}
          </span>
          {unread && (
            <span
              className="size-1.5 shrink-0 rounded-full bg-sale"
              aria-label="Chưa đọc"
            />
          )}
        </span>
        <span className="line-clamp-2 block text-xs leading-normal text-muted-foreground">
          {notification?.message}
        </span>
        <span className="block text-[11px] tabular-nums text-muted-foreground/80">
          {formatNotificationTime(notification?.created_at)}
        </span>
      </span>
    </span>
  );
};

export default NotificationItem;
