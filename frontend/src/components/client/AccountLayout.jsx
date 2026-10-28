import { Link, useLocation } from "react-router-dom";
import { ACCOUNT_LINKS } from "@/constants/accountNav";
import { cn } from "@/lib/utils";

const isActiveLink = (link, { pathname, hash }) => {
  const samePath = pathname === link.to || pathname.startsWith(`${link.to}/`);
  return samePath && hash === link.hash;
};

const AccountSidenav = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Tài khoản của tôi"
      className="flex gap-1.5 overflow-x-auto pb-2 print:hidden lg:sticky lg:top-24 lg:w-[220px] lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0"
    >
      {ACCOUNT_LINKS.map((link) => {
        const active = isActiveLink(link, location);
        const Icon = link.icon;
        return (
          <Link
            key={`${link.to}${link.hash}`}
            to={{ pathname: link.to, hash: link.hash }}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-lg border-l-2 px-3 py-2.5 text-[13px] font-semibold transition-colors",
              active
                ? "border-navy-600 bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-100"
                : "border-transparent text-muted-foreground hover:bg-navy-50 hover:text-navy-700 dark:hover:bg-navy-500/10",
            )}
          >
            <Icon size={15} strokeWidth={2} aria-hidden="true" />
            <span className="whitespace-nowrap">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

/**
 * Khung chung cho mọi trang trong cụm tài khoản: lề trang như các trang khách khác,
 * menu dọc 220px sticky, nội dung ở cột phải. Trang nào cũng có cùng đường ra.
 */
const AccountLayout = ({ title, subtitle, actions, children, className }) => (
  <div className="mx-auto w-full px-12 py-8 md:px-16 lg:px-24">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>

    <div className={cn("mt-6 grid items-start gap-6 print:grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]", className)}>
      <AccountSidenav />
      <div className="min-w-0">{children}</div>
    </div>
  </div>
);

export default AccountLayout;
