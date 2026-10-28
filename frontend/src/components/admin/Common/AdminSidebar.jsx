import { Link } from "react-router-dom";
import { ExternalLink, LogOut, Watch, X } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import {
  ADMIN_MENU_SECTIONS,
  findActiveMenuItem,
} from "../../../constants/adminMenu";

const AdminSidebar = ({
  open,
  onToggle,
  pathname,
  pendingOrders = 0,
  onLogout,
}) => {
  const activeItem = findActiveMenuItem(pathname);
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-card transition-[width,transform] duration-300 lg:relative lg:translate-x-0 print:hidden",
        !open && "-translate-x-full lg:w-20",
      )}
    >
      {/* Logo — hộp navy theo nhận diện */}
      <div className="flex h-15 shrink-0 items-center justify-between border-b border-border px-4">
        <Link to="/admin" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
            <Watch className="h-5 w-5" strokeWidth={2} />
          </span>
          <span
            className={cn(
              "flex flex-col leading-none transition-opacity duration-200",
              !open && "lg:hidden",
            )}
          >
            <span className="text-sm font-extrabold tracking-wide text-foreground">
              CHRONOS
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Admin
            </span>
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Đóng menu quản trị"
          onClick={onToggle}
          className="lg:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {ADMIN_MENU_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5 last:mb-0">
            <p
              className={cn(
                "mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground",
                !open && "lg:hidden",
              )}
            >
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = activeItem?.path === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      title={item.label}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-navy-50 hover:text-foreground",
                        "dark:hover:bg-navy-500/10",
                        active &&
                          "border-navy-600 bg-navy-600/10 font-semibold text-navy-700 dark:border-navy-300 dark:bg-navy-500/15 dark:text-navy-100",
                        !open && "lg:justify-center lg:px-0",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4.5 w-4.5 shrink-0",
                          active
                            ? "text-navy-600 dark:text-navy-100"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                        strokeWidth={2}
                      />
                      <span className={cn("flex-1", !open && "lg:hidden")}>
                        {item.label}
                      </span>
                      {item.badge === "order" && pendingOrders > 0 && (
                        <Badge
                          variant="warning"
                          className={cn(
                            "px-1.5 py-0 tabular-nums",
                            !open && "lg:hidden",
                          )}
                        >
                          {pendingOrders > 99 ? "99+" : pendingOrders}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-1 border-t border-border p-3">
        <Link
          to="/"
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-navy-50 hover:text-foreground dark:hover:bg-navy-500/10",
            !open && "lg:justify-center lg:px-0",
          )}
        >
          <ExternalLink className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
          <span className={cn(!open && "lg:hidden")}>Xem Website</span>
        </Link>
        <button
          onClick={onLogout}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sale transition-colors hover:bg-sale-soft dark:hover:bg-sale/15",
            !open && "lg:justify-center lg:px-0",
          )}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
          <span className={cn(!open && "lg:hidden")}>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
