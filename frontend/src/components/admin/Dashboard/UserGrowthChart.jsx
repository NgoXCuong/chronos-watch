import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { UserPlus } from "lucide-react";
import DashboardPanel from "../Common/DashboardPanel";
import { buildMonthlySeries } from "../../../utils/dashboardMetrics";
import { useChartTokens } from "../../../utils/chartTokens";

const GrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-hover">
      <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-extrabold text-violet-700 tabular-nums dark:text-violet-200">
        {payload[0].value} khách hàng mới
      </p>
    </div>
  );
};

// Thành viên mới theo tháng, 6 tháng gần nhất
const UserGrowthChart = ({ history, className }) => {
  const data = useMemo(() => buildMonthlySeries(history, 6), [history]);
  const chart = useChartTokens([
    "violet-600",
    "violet-300",
    "muted-foreground",
    "border",
    "accent",
  ]);
  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <DashboardPanel
      icon={UserPlus}
      tone="violet"
      className={className}
      title="Tăng trưởng khách hàng"
      subtitle="Thành viên mới 6 tháng"
      action={
        <span className="rounded-md border border-border bg-muted px-2 py-1 text-[11px] font-bold text-violet-700 tabular-nums dark:text-violet-200">
          {total} mới
        </span>
      }
      bodyClassName="h-56"
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
        >
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={chart["violet-600"]}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={chart["violet-600"]}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={chart.border} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: chart["muted-foreground"], fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fill: chart["muted-foreground"], fontSize: 11 }}
          />
          <Tooltip
            content={<GrowthTooltip />}
            cursor={{ stroke: chart["violet-300"], strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={chart["violet-600"]}
            strokeWidth={2}
            fill="url(#growthFill)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </DashboardPanel>
  );
};

export default UserGrowthChart;
