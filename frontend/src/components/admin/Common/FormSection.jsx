import { cn } from "@/lib/utils";

// Khung một khối trong form admin: header navy nhạt (icon + title + phụ chú) + body
const FormSection = ({
  title,
  hint,
  icon: Icon,
  actions,
  className,
  bodyClassName,
  children,
}) => (
  <section
    className={cn(
      "overflow-hidden rounded-xl border border-border bg-card shadow-card",
      className,
    )}
  >
    <header className="flex items-center justify-between gap-3 border-b border-border bg-navy-50/60 px-5 py-3 dark:bg-navy-500/10">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-card text-navy-600 ring-1 ring-navy-500/15 dark:bg-navy-500/20 dark:text-navy-100">
          {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
        </span>
        <div className="min-w-0">
          <h2 className="text-xs font-bold uppercase tracking-[0.02em] text-navy-700 dark:text-navy-100">
            {title}
          </h2>
          {hint && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {hint}
            </p>
          )}
        </div>
      </div>
      {actions}
    </header>

    <div className={cn("space-y-4 p-5", bodyClassName)}>{children}</div>
  </section>
);

export default FormSection;
