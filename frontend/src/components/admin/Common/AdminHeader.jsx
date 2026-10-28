import { cn } from "@/lib/utils";

// Header trang admin: tiêu đề + hành động trên một hàng, không dùng card chiếm chỗ
const AdminHeader = ({ title, subtitle, actions, className }) => (
  <div
    className={cn(
      "flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-border pb-4",
      className,
    )}
  >
    <div className="min-w-0">
      <h1 className="flex items-center gap-2.5 text-[19px] font-extrabold tracking-tight text-foreground">
        <span className="h-4 w-1 shrink-0 rounded-full bg-navy-600 dark:bg-navy-300" />
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 pl-3.5 text-[13px] text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
    {actions && (
      <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
    )}
  </div>
);

export default AdminHeader;
