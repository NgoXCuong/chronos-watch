import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User,
  Heart,
  ShoppingCart,
  Search,
  Bell,
} from "lucide-react";
import Topbar from "../market/Topbar";
import MarketHeader from "../market/MarketHeader";
import MainNav, { NAV_LINKS, Item } from "../market/MainNav";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

/** Khung đầu trang sàn TMĐT: Topbar 36px → (sticky) Header 74px searchbar + nav ngang; mobile có menu trượt. */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const isDark = theme === "dark";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(mobileQuery.trim())}`);
      setMobileQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Topbar />
      <header className="sticky top-0 z-100 border-b border-border bg-background">
        <div className="mx-auto w-full px-12 md:px-16 lg:px-24">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent hover:text-navy-600 md:hidden"
            >
              <Menu size={22} strokeWidth={2} aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <MarketHeader />
            </div>
          </div>
          <div className="hidden border-t border-border md:block">
            <MainNav />
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-150 md:hidden">
          <div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col bg-background shadow-hover">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="text-base font-extrabold uppercase tracking-[0.14em] text-navy-900">
                Chronos
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Đóng menu"
                className="flex size-9 items-center justify-center rounded-lg hover:bg-accent"
              >
                <X size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <form
              onSubmit={handleMobileSearch}
              className="flex items-center gap-2 border-b border-border p-3"
            >
              <div className="relative flex-1">
                <Search
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  placeholder="Tìm kiếm đồng hồ..."
                  className="h-10 w-full rounded-lg border border-navy-600 bg-transparent pr-3 pl-9 text-sm outline-none focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.12)]"
                />
              </div>
              <button
                type="submit"
                className="flex h-10 items-center rounded-lg bg-navy-600 px-3 text-xs font-semibold uppercase text-white"
              >
                Tìm
              </button>
            </form>

            <nav
              className="flex-1 overflow-y-auto py-2"
              aria-label="Điều hướng di động"
            >
              {NAV_LINKS.map((link) => (
                <Item
                  key={link.to}
                  link={link}
                  onClick={() => setMobileOpen(false)}
                  className="w-full px-4 py-3 text-foreground/90 [&.active]:bg-navy-50 [&.active]:text-navy-600"
                />
              ))}
            </nav>

            <div className="border-t border-border p-3">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <User size={16} strokeWidth={2} aria-hidden="true" />
                    {user?.full_name || user?.username}
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <Heart size={16} strokeWidth={2} aria-hidden="true" /> Yêu
                    thích
                  </Link>
                  <Link
                    to="/notifications"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <Bell size={16} strokeWidth={2} aria-hidden="true" /> Thông
                    báo
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    <ShoppingCart
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />{" "}
                    Giỏ hàng
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-sale-soft"
                  >
                    <LogOut size={16} strokeWidth={2} aria-hidden="true" /> Đăng
                    xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="flex h-10 items-center justify-center rounded-lg border border-navy-600 text-xs font-semibold uppercase text-navy-700"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex h-10 items-center justify-center rounded-lg bg-navy-600 text-xs font-semibold uppercase text-white"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
              >
                {isDark ? (
                  <Sun size={16} strokeWidth={2} />
                ) : (
                  <Moon size={16} strokeWidth={2} />
                )}
                Giao diện: {isDark ? "Sáng" : "Tối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
