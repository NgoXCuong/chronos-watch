import { cn } from "../../../lib/utils";
import { uiTone } from "../../../constants/uiTones";

// Vỏ panel dashboard dùng chung: header dải màu nhạt (icon chip + title/subtitle) + action góc phải
const DashboardPanel = ({
  icon: Icon,
  title,
  subtitle,
  tone = "navy",
  action,
  children,
  className,
  bodyClassName,
}) => {
  const t = uiTone(tone);
  return (
    <section
      className={cn(
        "flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card",
        className,
      )}
    >
      <header
        className={cn(
          "flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4",
          t.block,
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-card",
                t.chip,
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
          )}
          <div className="min-w-0">
            <h3 className={cn("truncate text-base font-bold", t.value)}>
              {title}
            </h3>
            {subtitle && (
              <p className="truncate text-[11px] uppercase tracking-[0.02em] text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>

      <div className={cn("min-h-0 flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
};

export default DashboardPanel;
