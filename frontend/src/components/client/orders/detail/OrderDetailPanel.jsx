import { cn } from "@/lib/utils";

/** Khung panel dùng chung cho trang chi tiết đơn: header có icon + tiêu đề + ô góc phải. */
const OrderDetailPanel = ({ title, icon: Icon, aside, children, className, bodyClassName }) => (
  <section
    className={cn(
      "rounded-xl border border-border bg-card shadow-card print:border-0 print:shadow-none",
      className,
    )}
  >
    <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">
        {Icon && <Icon size={15} strokeWidth={2} className="text-navy-500" aria-hidden="true" />}
        {title}
      </h2>
      {aside}
    </header>
    <div className={cn("px-4 py-3", bodyClassName)}>{children}</div>
  </section>
);

export default OrderDetailPanel;
