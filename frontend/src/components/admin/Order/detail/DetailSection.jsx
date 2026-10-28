import { cn } from "@/lib/utils";

// Khung chung cho mọi section trang chi tiết đơn: header navy nhạt + nội dung
const DetailSection = ({
  title,
  icon: Icon,
  actions,
  className,
  bodyClassName,
  children,
}) => (
  <section
    className={cn(
      "overflow-hidden rounded-xl border border-border bg-card shadow-card print:hidden",
      className,
    )}
  >
    <header className="flex items-center justify-between gap-3 border-b border-border bg-navy-50/60 px-5 py-3.5 dark:bg-navy-500/10">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
        {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />}
        {title}
      </h2>
      {actions}
    </header>
    <div className={cn("p-5", bodyClassName)}>{children}</div>
  </section>
);

export default DetailSection;
