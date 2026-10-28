import React from "react";
import { Link } from "react-router-dom";
import { Truck, Headphones, Phone, Mail, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

/** Thanh tin hiệu 36px nền navy-900 — hotline, hỗ trợ, đăng nhập/đăng ký, toggle theme. */
const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isDark = theme === "dark";

  return (
    <div className="hidden bg-navy-900 text-navy-100 md:block">
      <div className="mx-auto flex h-9 w-full items-center justify-between text-xs px-12 md:px-16 lg:px-24">
        <p className="flex items-center gap-2">
          <Truck size={14} strokeWidth={2} aria-hidden="true" />
          Miễn phí vận chuyển cho đơn hàng từ 499.000₫
        </p>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <Headphones size={14} strokeWidth={2} aria-hidden="true" /> Hỗ trợ
            24/7
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={14} strokeWidth={2} aria-hidden="true" /> 1900 8888 66
          </span>
          <a
            href="mailto:contact@chronos.com"
            className="flex items-center gap-1.5 hover:text-white"
          >
            <Mail size={14} strokeWidth={2} aria-hidden="true" />{" "}
            contact@chronos.com
          </a>
          <span className="h-3.5 w-px bg-navy-700" aria-hidden="true" />
          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:text-white">
                Đăng nhập
              </Link>
              <span className="text-navy-700">|</span>
              <Link to="/register" className="hover:text-white">
                Đăng ký
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            aria-label={
              isDark
                ? "Chuyển sang giao diện sáng"
                : "Chuyển sang giao diện tối"
            }
            className="flex size-6 items-center justify-center rounded-md hover:bg-navy-800 hover:text-white"
          >
            {isDark ? (
              <Sun size={14} strokeWidth={2} />
            ) : (
              <Moon size={14} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
