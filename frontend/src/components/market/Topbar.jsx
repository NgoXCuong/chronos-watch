import React from "react";
import { Link } from "react-router-dom";
import { Truck, Headphones, Phone, Mail, Sun, Moon, TicketPercent } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

/** Thanh tin hiệu 36px nền navy-900 — hotline, hỗ trợ, đăng nhập/đăng ký, toggle theme. */
const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isDark = theme === "dark";

  return (
    <div className="hidden border-b border-border bg-muted/50 text-muted-foreground md:block">
      <div className="mx-auto flex h-9 w-full items-center justify-between px-4 text-[11px] sm:px-8 md:px-16 lg:px-24">
        <p className="flex items-center gap-2">
          <Truck size={14} strokeWidth={2} aria-hidden="true" />
          Miễn phí vận chuyển toàn quốc
        </p>
        <div className="flex items-center gap-5">
          <Link to="/vouchers" className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:underline"><TicketPercent size={14} aria-hidden="true" />Voucher</Link>
          <span className="hidden items-center gap-1.5 xl:flex">
            <Headphones size={14} strokeWidth={2} aria-hidden="true" /> Hỗ trợ
            24/7
          </span>
          <span className="hidden items-center gap-1.5 lg:flex">
            <Phone size={14} strokeWidth={2} aria-hidden="true" /> 1900 8888 66
          </span>
          <a
            href="mailto:contact@chronos.com"
            className="hidden items-center gap-1.5 hover:text-foreground xl:flex"
          >
            <Mail size={14} strokeWidth={2} aria-hidden="true" />{" "}
            contact@chronos.com
          </a>
          <span className="h-3.5 w-px bg-border" aria-hidden="true" />
          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:text-foreground">
                Đăng nhập
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link to="/register" className="hover:text-foreground">
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
            className="flex size-6 items-center justify-center rounded-md hover:bg-accent hover:text-foreground"
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
