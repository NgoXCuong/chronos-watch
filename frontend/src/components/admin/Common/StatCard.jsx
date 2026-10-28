// import { Minus, TrendingDown, TrendingUp } from "lucide-react";
// import { Badge } from "../../ui/badge";
// import { cn } from "../../../lib/utils";
// import { uiTone } from "../../../constants/uiTones";

// // Cột cuối là kỳ hiện tại (tô đậm), các cột trước nhạt — dữ liệu thật theo tháng
// const MiniBars = ({ values, tone }) => {
//   const t = uiTone(tone);
//   const max = Math.max(...values);
//   return (
//     <div className="mt-3 flex h-8 items-end gap-1.5" aria-hidden="true">
//       {values.map((value, index) => (
//         <span
//           key={index}
//           style={{
//             height: `${max > 0 ? Math.max(10, (value / max) * 100) : 10}%`,
//           }}
//           className={cn(
//             "flex-1 rounded-sm",
//             index === values.length - 1 ? t.bar : t.barMuted,
//           )}
//         />
//       ))}
//     </div>
//   );
// };

// const DeltaBadge = ({ trend }) => {
//   const flat = trend === "0%" || trend === "+0.0%" || trend === "-0.0%";
//   const up = !flat && trend.startsWith("+");
//   const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
//   return (
//     <Badge
//       variant={flat ? "muted" : up ? "success" : "destructive-soft"}
//       className="gap-1 tabular-nums"
//     >
//       <Icon className="h-3 w-3" strokeWidth={2.5} />
//       {trend}
//     </Badge>
//   );
// };

// // KPI Card — `tone` quyết cả khối màu nhạt (nền + viền trên + chip + số + mini-bar)
// const StatCard = ({
//   label,
//   value,
//   icon: Icon,
//   trend,
//   hist = [],
//   hint,
//   loading,
//   tone = "navy",
// }) => {
//   const t = uiTone(tone);
//   return (
//     <div
//       className={cn(
//         "relative overflow-hidden rounded-xl border p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover",
//         t.block,
//         loading && "animate-pulse",
//       )}
//     >
//       <span className={cn("absolute inset-x-0 top-0 h-1", t.edge)} />
//       <div className="flex items-start justify-between gap-3">
//         <span
//           className={cn(
//             "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-card",
//             t.chip,
//           )}
//         >
//           {Icon && <Icon className="h-5 w-5" strokeWidth={2} />}
//         </span>
//         {trend && <DeltaBadge trend={trend} />}
//       </div>

//       {loading ? (
//         <div className="mt-4 h-8 w-28 rounded-lg bg-muted" />
//       ) : (
//         <p
//           className={cn(
//             "mt-3 text-[26px] font-extrabold leading-tight tabular-nums",
//             t.value,
//           )}
//         >
//           {value}
//         </p>
//       )}

//       <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.02em] text-muted-foreground">
//         {label}
//       </p>

//       {!loading && hist.some((item) => item > 0) && (
//         <MiniBars values={hist} tone={tone} />
//       )}
//       {!loading && hint && (
//         <p className="mt-2 truncate text-[11px] text-muted-foreground">
//           {hint}
//         </p>
//       )}
//     </div>
//   );
// };

// export default StatCard;

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../../ui/badge";
import { cn } from "../../../lib/utils";
import { uiTone } from "../../../constants/uiTones";

// Cột cuối là kỳ hiện tại (tô đậm), các cột trước nhạt — dữ liệu thật theo tháng
const MiniBars = ({ values, tone }) => {
  const t = uiTone(tone);
  const max = Math.max(...values);
  return (
    <div className="mt-2 flex h-5 items-end gap-1" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={index}
          style={{
            height: `${max > 0 ? Math.max(15, (value / max) * 100) : 15}%`,
          }}
          className={cn(
            "flex-1 rounded-sm",
            index === values.length - 1 ? t.bar : t.barMuted,
          )}
        />
      ))}
    </div>
  );
};

const DeltaBadge = ({ trend }) => {
  const flat = trend === "0%" || trend === "+0.0%" || trend === "-0.0%";
  const up = !flat && trend.startsWith("+");
  const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
  return (
    <Badge
      variant={flat ? "muted" : up ? "success" : "destructive-soft"}
      className="gap-1 text-[11px] px-1.5 py-0.5 tabular-nums shrink-0"
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {trend}
    </Badge>
  );
};

// KPI Card — Tối ưu layout mỏng gọn, nằm ngang
const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  hist = [],
  hint,
  loading,
  tone = "navy",
}) => {
  const t = uiTone(tone);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-3.5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover flex flex-col justify-between",
        t.block,
        loading && "animate-pulse",
      )}
    >
      <span className={cn("absolute inset-x-0 top-0 h-1", t.edge)} />

      {/* Hàng 1: [Icon] + [Con số lớn] bên trái | [Trend Badge] bên phải */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-card",
                t.chip,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
          )}

          {loading ? (
            <div className="h-7 w-20 rounded-md bg-muted" />
          ) : (
            <p
              className={cn(
                "text-2xl font-extrabold leading-none tabular-nums truncate",
                t.value,
              )}
            >
              {value}
            </p>
          )}
        </div>

        {trend && <DeltaBadge trend={trend} />}
      </div>

      {/* Hàng 2: Tên nhãn IN HOA / BOLD */}
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
        {label}
      </p>

      {/* Hàng 3: Chú thích nhỏ hoặc Biểu đồ cột mini */}
      {!loading && (hint || hist.some((item) => item > 0)) && (
        <div className="mt-1.5 pt-1.5 border-t border-border/40 flex flex-col justify-end">
          {hist.some((item) => item > 0) && (
            <MiniBars values={hist} tone={tone} />
          )}
          {hint && (
            <p
              className="truncate text-[11px] text-muted-foreground leading-tight"
              title={hint}
            >
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
