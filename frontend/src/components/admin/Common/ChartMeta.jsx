import { cn } from "../../../lib/utils";

// Chú giải loạt dữ liệu cho biểu đồ (màu do chartTokens resolve tại runtime)
export const ChartLegend = ({ series = [], className }) => (
  <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}>
    {series.map(({ label, color, shape = "bar" }) => (
      <span
        key={label}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground"
      >
        <span
          className={cn(
            "inline-block shrink-0",
            shape === "bar"
              ? "h-2.5 w-2.5 rounded-sm"
              : "h-[3px] w-4 rounded-full",
          )}
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
    ))}
  </div>
);

// Dải số nhỏ dưới biểu đồ: giải thích ngay biểu đồ đang nói gì
export const ChartSummary = ({ items = [], className }) => (
  <div
    className={cn(
      "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4",
      className,
    )}
  >
    {items.map(({ label, value, hint }) => (
      <div key={label} className="bg-card px-3 py-2">
        <p className="truncate text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-[14px] font-extrabold text-navy-600 tabular-nums dark:text-navy-100">
          {value}
        </p>
        {hint && (
          <p className="truncate text-[11px] text-muted-foreground tabular-nums">
            {hint}
          </p>
        )}
      </div>
    ))}
  </div>
);
