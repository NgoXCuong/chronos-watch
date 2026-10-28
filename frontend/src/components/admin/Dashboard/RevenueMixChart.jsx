import { useState } from "react";
import { PieChart as PieIcon } from "lucide-react";
import DashboardPanel from "../Common/DashboardPanel";
import {
  formatCompactVnd,
  formatCurrency,
} from "../../../utils/formatCurrency";
import { SERIES_TOKENS, useChartTokens } from "../../../utils/chartTokens";
import { cn } from "../../../lib/utils";

const TABS = [
  { id: "category", label: "Ngành hàng" },
  { id: "brand", label: "Thương hiệu" },
];

// Tỷ trọng doanh thu theo ngành hàng / thương hiệu — thanh ngang, không cần recharts
const RevenueMixChart = ({ byCategory, byBrand }) => {
  const [tab, setTab] = useState("category");
  const chart = useChartTokens([...SERIES_TOKENS, "muted", "border"]);
  const rows = (tab === "category" ? byCategory : byBrand) || [];
  const max = Math.max(...rows.map((r) => r.revenue), 1);

  return (
    <DashboardPanel
      icon={PieIcon}
      tone="teal"
      title="Cơ cấu doanh thu"
      subtitle="Toàn thời gian, loại đơn hủy"
      action={
        <div className="flex rounded-lg border border-border p-0.5">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors",
                tab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      }
    >
      {rows.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/40 py-8 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            Chưa có dữ liệu doanh thu
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row, index) => (
            <li key={row.name}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="truncate text-[12px] font-semibold text-card-foreground">
                  {row.name}
                </span>
                <span className="shrink-0 text-[12px] font-bold text-navy-600 tabular-nums dark:text-navy-100">
                  {formatCompactVnd(row.revenue)}
                  <span className="ml-1 text-[11px] font-medium text-muted-foreground">
                    · {row.share}%
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{
                    width: `${Math.max(4, (row.revenue / max) * 100)}%`,
                    backgroundColor:
                      chart[
                        SERIES_TOKENS[index % SERIES_TOKENS.length]
                      ],
                  }}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
                {row.units} sản phẩm đã bán · {formatCurrency(row.revenue)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
};

export default RevenueMixChart;
