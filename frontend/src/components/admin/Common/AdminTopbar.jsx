import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Menu } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import NotificationBell from "../../notifications/NotificationBell";
import { getAdminPageTitle } from "../../../constants/adminMenu";

// Avatar chỉ dựng initials — ảnh đại diện sẽ thêm khi có trường avatar trong CSDL
const UserChip = ({ user }) => {
  const name = user?.full_name || user?.username || "Quản trị";
  return (
    <div className="flex items-center gap-3 border-l border-border pl-4">
      <div className="hidden text-right sm:block">
        <p className="text-[13px] font-semibold leading-tight text-foreground">
          {name}
        </p>
        <Badge variant="brand" className="mt-0.5">
          Quản trị
        </Badge>
      </div>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

const AdminTopbar = ({
  pathname,
  user,
  onToggleSidebar,
  notifications,
  unreadCount,
  onMarkAllRead,
  onMarkRead,
}) => {
  const title = getAdminPageTitle(pathname);
  const isDashboard = title === "Dashboard";
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-border bg-card/85 px-4 backdrop-blur-md md:px-6 print:hidden">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Mở menu quản trị"
          onClick={onToggleSidebar}
          className="text-muted-foreground"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </Button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5"
        >
          <Link
            to="/admin"
            className={cn(
              "truncate text-sm font-medium text-muted-foreground transition-colors hover:text-navy-700 dark:hover:text-navy-100",
              isDashboard && "hidden",
            )}
          >
            Quản trị
          </Link>
          {!isDashboard && (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
          )}
          <span className="truncate text-sm font-bold text-foreground">
            {title}
          </span>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={onMarkAllRead}
          onSelect={(notification) => {
            onMarkRead?.(notification.id);
            if (notification.link) navigate(notification.link);
          }}
          footer={{ to: "/admin/notifications", label: "Xem tất cả thông báo" }}
        />
        <UserChip user={user} />
      </div>
    </header>
  );
};

export default AdminTopbar;
