import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Tag,
  FolderTree,
  Ticket,
  Diamond,
  Star,
  LineChart,
  ExternalLink,
  Bell,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "../../lib/utils";
import adminApi from "../../api/admin.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await adminApi.getNotifications();
      setNotifications(data);
      setUnreadCount(data.length);
    } catch (error) {
      console.error("Lỗi lấy thông báo:", error);
    }
  };

  const handleNotificationClick = (link) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
    navigate(link);
  };

  const menuSections = [
    {
      title: "TỔNG QUAN",
      items: [{ path: "/admin", icon: LayoutDashboard, label: "Dashboard" }],
    },
    {
      title: "QUẢN LÝ",
      items: [
        { path: "/admin/products", icon: Box, label: "Sản phẩm" },
        { path: "/admin/categories", icon: FolderTree, label: "Danh mục" },
        { path: "/admin/brands", icon: Diamond, label: "Thương hiệu" },
        { path: "/admin/orders", icon: ClipboardList, label: "Đơn hàng" },
        { path: "/admin/vouchers", icon: Ticket, label: "Voucher" },
        { path: "/admin/reviews", icon: Star, label: "Đánh giá" },
      ],
    },
    {
      title: "HỆ THỐNG",
      items: [{ path: "/admin/users", icon: Users, label: "Người dùng" }],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50 transition-colors duration-300 font-roboto">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-48 bg-white border-r border-slate-200 transition-transform duration-300 transform lg:relative lg:translate-x-0 shadow-sm",
          !isSidebarOpen && "-translate-x-full lg:w-20",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-2 font-bold text-base",
                !isSidebarOpen && "lg:hidden",
              )}
            >
              <span className="text-amber-600 font-heading">CHRONOS</span>
              <span className="text-slate-900 font-light text-[12px] uppercase">
                SYSTEM
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-slate-500"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-0 overflow-y-auto scrollbar-hide py-4">
            {menuSections.map((section) => (
              <div key={section.title} className="mb-4">
                {isSidebarOpen && (
                  <div className="px-4 py-2 text-[12px] font-bold text-slate-500 uppercase">
                    {section.title}
                  </div>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== "/admin" &&
                        location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group text-sm relative",
                          isActive
                            ? "bg-amber-50 text-amber-700 font-bold border-l-4 border-amber-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-amber-600"
                              : "text-slate-400 group-hover:text-slate-600",
                          )}
                        />
                        <span
                          className={cn(
                            "transition-opacity duration-300",
                            !isSidebarOpen && "lg:hidden",
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-slate-300 bg-white">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm group",
                !isSidebarOpen && "lg:justify-center",
              )}
            >
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              <span className={cn(!isSidebarOpen && "lg:hidden font-medium")}>
                Xem Website
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors mt-1 text-sm group",
                !isSidebarOpen && "lg:justify-center",
              )}
            >
              <LogOut className="h-4 w-4 text-rose-500" />
              <span className={cn(!isSidebarOpen && "lg:hidden font-bold ")}>
                Đăng xuất
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl h-10 w-10 border border-transparent hover:border-slate-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-slate-800 font-heading ">
              {menuSections
                .flatMap((s) => s.items)
                .find(
                  (i) =>
                    i.path === location.pathname ||
                    (i.path !== "/admin" &&
                      location.pathname.startsWith(i.path)),
                )?.label || "Quản trị"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative h-10 w-10 rounded-full bg-slate-50 text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-100 transition-all group",
                )}
              >
                <Bell className="h-5 w-5 group-hover:animate-swing" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white ring-1 ring-rose-500/20">
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 p-0 bg-white rounded-md shadow-2xl border-slate-100 overflow-hidden ring-1 ring-slate-200/50"
              >
                <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    Thông báo
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-[10px] font-bold text-amber-600 hover:underline uppercase "
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
                <div className="max-h-100 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.link)}
                        className="p-4 cursor-pointer border-b border-slate-50 hover:bg-slate-50/80 transition-all flex items-start gap-4 focus:bg-amber-50/30"
                      >
                        <div
                          className={`mt-1 p-2 rounded-xl shrink-0 ${
                            notif.type === "order"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {notif.type === "order" ? (
                            <ClipboardList size={16} />
                          ) : (
                            <Box size={16} />
                          )}
                        </div>
                        <div className="space-y-1 py-0.5">
                          <p className="text-xs font-bold text-slate-900 leading-tight">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[12px] text-slate-400 font-medium uppercase">
                            {new Date(notif.time).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            • {new Date(notif.time).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-600 uppercase ">
                        Tất cả đều ổn!
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        Không có thông báo mới nào
                      </p>
                    </div>
                  )}
                </div>
                <Link
                  to="/admin/orders"
                  className="block text-center py-4 text-xs font-bold text-slate-500 hover:text-amber-600 bg-slate-50 hover:bg-white transition-all uppercase border-t border-slate-100"
                >
                  Xem tất cả báo cáo
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Info */}
            <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
              <div className="flex flex-col items-end sm:flex">
                <span className="text-sm font-bold text-slate-800 leading-none">
                  {user?.full_name || user?.username}
                </span>
                <span className="text-[10px] text-amber-600 font-bold mt-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                  Admin
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-amber-600/20 ring-4 ring-white">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
