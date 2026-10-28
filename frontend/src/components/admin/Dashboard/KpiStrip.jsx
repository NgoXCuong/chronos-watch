import { cn } from "../../../lib/utils";
import { uiTone } from "../../../constants/uiTones";

// Dải chỉ số phụ: một card duy nhất, các ô ngăn bằng đường kẻ 1px (đặc hơn 6 card rời)
const KpiStrip = ({ items = [], loading }) => (
  <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-card md:grid-cols-3 xl:grid-cols-6">
    {items.map(({ label, value, hint, icon: Icon, tone = "navy" }) => {
      const t = uiTone(tone);
      return (
        <div
          key={label}
          className={cn(
            "flex items-center gap-3 px-4 py-3 transition-colors",
            t.block,
          )}
        >
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-card",
              t.chip,
            )}
          >
            {Icon && <Icon className="h-[18px] w-[18px]" strokeWidth={2} />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
              {label}
            </p>
            {loading ? (
              <div className="mt-1 h-5 w-16 animate-pulse rounded bg-muted" />
            ) : (
              <p
                className={cn(
                  "truncate text-[17px] font-extrabold leading-tight tabular-nums",
                  t.value,
                )}
              >
                {value}
              </p>
            )}
            {hint && !loading && (
              <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default KpiStrip;
