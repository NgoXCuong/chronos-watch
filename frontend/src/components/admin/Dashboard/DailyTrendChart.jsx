import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity } from "lucide-react";
import adminApi from "../../../api/admin.api";
import DashboardPanel from "../Common/DashboardPanel";
import { ChartLegend, ChartSummary } from "../Common/ChartMeta";
import {
  buildDailySeries,
  summarizeSeries,
} from "../../../utils/dashboardMetrics";
import {
  formatCompactVnd,
  formatCurrency,
} from "../../../utils/formatCurrency";
import { useChartTokens } from "../../../utils/chartTokens";

const DAYS = 14;
const toInputDate = (d) => d.toISOString().split("T")[0];

const DayTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-hover">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
        Ngày {label}
      </p>
      <p className="text-sm font-extrabold text-navy-600 tabular-nums dark:text-navy-100">
        {formatCurrency(point.revenue)}
      </p>
      <p className="text-[11px] text-muted-foreground tabular-nums">
        {point.orders} đơn hàng
      </p>
    </div>
  );
};

// Nhịp bán hàng ngắn hạn: cột doanh thu từng ngày, đường số đơn, đường trung bình kỳ
const DailyTrendChart = ({ className }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (DAYS - 1));

    adminApi
      .getRevenueStats(toInputDate(start), toInputDate(end))
      .then((res) => {
        if (!cancelled) setRows(res?.revenue_history || []);
      })
      .catch((error) => console.error("Lỗi tải doanh thu theo ngày:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const series = useMemo(() => buildDailySeries(rows, DAYS), [rows]);
  const summary = useMemo(() => summarizeSeries(series), [series]);
  const chart = useChartTokens([
    "navy-600",
    "navy-300",
    "navy-200",
    "muted-foreground",
    "border",
    "accent",
  ]);

  return (
    <DashboardPanel
      icon={Activity}
      tone="teal"
      className={className}
      title="Nhịp bán hàng 14 ngày"
      subtitle="Doanh thu và số đơn theo từng ngày"
      bodyClassName="flex flex-col"
      action={
        <ChartLegend
          series={[
            { label: "Doanh thu", color: chart["navy-600"] },
            { label: "Số đơn", color: chart["navy-300"], shape: "line" },
          ]}
        />
      }
    >
      {loading ? (
        <div className="h-56 w-full animate-pulse rounded-lg bg-muted" />
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <ComposedChart
              data={series}
              margin={{ top: 16, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke={chart.border}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: chart.border }}
                tickLine={false}
                interval={0}
                tick={{ fill: chart["muted-foreground"], fontSize: 10 }}
                dy={8}
              />
              <YAxis
                yAxisId="revenue"
                axisLine={false}
                tickLine={false}
                width={54}
                tick={{ fill: chart["muted-foreground"], fontSize: 10 }}
                tickFormatter={(val) => formatCompactVnd(val)}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={30}
                allowDecimals={false}
                tick={{ fill: chart["muted-foreground"], fontSize: 10 }}
              />
              <Tooltip
                content={<DayTooltip />}
                cursor={{ fill: chart.accent, opacity: 0.4 }}
              />
              <ReferenceLine
                yAxisId="revenue"
                stroke={chart["navy-200"]}
                strokeDasharray="5 4"
                strokeWidth={2}
                y={summary.average}
              />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                fill={chart["navy-600"]}
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
                animationDuration={700}
              >
                <LabelList
                  dataKey="revenue"
                  position="top"
                  formatter={(val) => (val > 0 ? formatCompactVnd(val) : "")}
                  fill={chart["muted-foreground"]}
                  fontSize={9}
                  fontWeight={700}
                />
              </Bar>
              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke={chart["navy-300"]}
                strokeWidth={2}
                dot={{ r: 2.5, fill: chart["navy-300"], strokeWidth: 0 }}
                animationDuration={700}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <ChartSummary
        className="mt-4 shrink-0"
        items={[
          {
            label: "Tổng 14 ngày",
            value: formatCompactVnd(summary.revenue),
            hint: formatCurrency(summary.revenue),
          },
          {
            label: "Đơn hàng",
            value: summary.orders,
            hint: `TB ${formatCompactVnd(summary.average)}/ngày`,
          },
          {
            label: "Ngày cao nhất",
            value: summary.peakName,
            hint: formatCompactVnd(summary.peakRevenue),
          },
          {
            label: "Ngày có đơn",
            value: `${summary.active}/${summary.total}`,
            hint: `${summary.total - summary.active} ngày trống`,
          },
        ]}
      />
    </DashboardPanel>
  );
};

export default DailyTrendChart;
