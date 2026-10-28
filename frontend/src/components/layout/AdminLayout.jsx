import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import AdminSidebar from "../admin/Common/AdminSidebar";
import AdminTopbar from "../admin/Common/AdminTopbar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllRead, markRead, counts } =
    useNotifications();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background font-sans">
      <AdminSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        pathname={location.pathname}
        pendingOrders={counts?.pendingOrders ?? 0}
        onLogout={handleLogout}
      />

      {/* Phủ nền khi sidebar mở trên mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/40 lg:hidden print:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar
          pathname={location.pathname}
          user={user}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          onMarkRead={markRead}
        />
        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
