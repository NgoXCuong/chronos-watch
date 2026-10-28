import { Bell, Check, ExternalLink } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import {
  NOTIFICATION_ICON,
  NOTIFICATION_TYPE_LABEL,
} from "@/constants/notificationTypes";
import { formatNotificationTime } from "../../../utils/notifications";

// Ô nội dung: icon theo loại + tiêu đề đậm khi chưa đọc + dòng mô tả rút gọn.
export const NotificationContentCell = ({ notification }) => {
  const Icon = NOTIFICATION_ICON[notification?.type] ?? Bell;
  const unread = !notification?.read_at;

  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          unread
            ? "bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-100"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-[13px] leading-tight",
            unread
              ? "font-bold text-foreground"
              : "font-semibold text-foreground/75",
          )}
        >
          {notification?.title}
        </p>
        <p className="mt-1 line-clamp-1 text-xs leading-normal text-muted-foreground">
          {notification?.message}
        </p>
      </div>
    </div>
  );
};

export const NotificationTypeCell = ({ type }) => (
  <Badge variant="outline" className="font-semibold">
    {NOTIFICATION_TYPE_LABEL[type] ?? type}
  </Badge>
);

export const NotificationStatusCell = ({ readAt }) =>
  readAt ? (
    <Badge variant="muted">Đã đọc</Badge>
  ) : (
    <Badge variant="sale">Chưa đọc</Badge>
  );

export const NotificationTimeCell = ({ value }) => (
  <span className="text-xs tabular-nums text-muted-foreground">
    {formatNotificationTime(value)}
  </span>
);

// Hành động dòng: mở link nghiệp vụ nếu có, không có thì chỉ đánh dấu đã đọc.
// Dòng đã đọc + không có link thì hiện dấu check mờ, không bày nút bấm vô nghĩa.
export const NotificationOpenAction = ({ notification, onOpen }) => {
  if (notification?.link) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Mở thông báo: ${notification?.title}`}
        title="Mở"
        onClick={() => onOpen?.(notification)}
        className="h-8 w-8 text-muted-foreground hover:text-navy-700 dark:hover:text-navy-100"
      >
        <ExternalLink className="h-4 w-4" strokeWidth={2} />
      </Button>
    );
  }

  if (notification?.read_at) {
    return (
      <span
        title="Đã đọc"
        className="flex h-8 w-8 items-center justify-center text-muted-foreground/50"
      >
        <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Đánh dấu đã đọc: ${notification?.title}`}
      title="Đánh dấu đã đọc"
      onClick={() => onOpen?.(notification)}
      className="h-8 w-8 text-muted-foreground hover:text-navy-700 dark:hover:text-navy-100"
    >
      <Check className="h-4 w-4" strokeWidth={2} />
    </Button>
  );
};
