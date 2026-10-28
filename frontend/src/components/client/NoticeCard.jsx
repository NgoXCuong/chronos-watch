import { cn } from "@/lib/utils";

// Khối trạng thái dùng chung cho mọi trang khách: rỗng danh sách / lỗi không tìm thấy
// (khách không bao giờ thấy một ô "—" trần).
const NoticeCard = ({ icon: Icon, title, description, tone = "muted", children, className }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center",
      className,
    )}
  >
    <div
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full",
        tone === "error" ? "bg-sale-soft text-sale" : "bg-navy-50 text-navy-500 dark:bg-navy-500/15",
      )}
    >
      {Icon && <Icon className="h-7 w-7" strokeWidth={1.8} />}
    </div>
    <h3 className="text-base font-semibold text-foreground">{title}</h3>
    {description && (
      <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">{description}</p>
    )}
    {children && <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{children}</div>}
  </div>
);

export default NoticeCard;
