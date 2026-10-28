import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import AccountLayout from "@/components/client/AccountLayout";
import NoticeCard from "@/components/client/NoticeCard";
import NotificationItem from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { cn } from "@/lib/utils";

const ListSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-border bg-card">
    {[1, 2, 3, 4].map((row) => (
      <div
        key={row}
        className="flex items-start gap-3 border-b border-border/60 p-4 last:border-b-0"
      >
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    ))}
  </div>
);

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, refresh, markRead, markAllRead } =
    useNotificationsContext();

  return (
    <AccountLayout
      title="Thông báo"
      subtitle="Cập nhật đơn hàng, thanh toán và bảo hành của bạn — trạng thái đã đọc được lưu lại."
      actions={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={refresh}
            loading={loading}
            aria-label="Tải lại thông báo"
            title="Tải lại thông báo"
            className="h-9 w-9"
          >
            {!loading && <RefreshCw className="h-4 w-4" strokeWidth={2} />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="h-9 gap-2"
          >
            <CheckCheck className="h-4 w-4" strokeWidth={2} />
            Đánh dấu đã đọc
          </Button>
        </div>
      }
    >
      {loading && notifications.length === 0 ? (
        <ListSkeleton />
      ) : notifications.length === 0 ? (
        <NoticeCard
          icon={Bell}
          title="Chưa có thông báo"
          description="Khi bạn đặt hàng hoặc có phản hồi bảo hành, thông báo sẽ xuất hiện tại đây."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => {
                markRead(notification.id);
                if (notification.link) navigate(notification.link);
              }}
              className={cn(
                "flex w-full items-start border-b border-border/60 p-4 text-left transition-colors last:border-b-0 hover:bg-navy-50 dark:hover:bg-navy-500/10",
                !notification.read_at && "bg-navy-50/60 dark:bg-navy-500/10",
              )}
            >
              <NotificationItem notification={notification} />
            </button>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default NotificationsPage;
