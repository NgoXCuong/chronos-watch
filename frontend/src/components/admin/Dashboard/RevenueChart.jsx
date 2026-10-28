import { useCallback, useEffect, useMemo, useState } from "react";
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
import { TrendingUp, RefreshCw } from "lucide-react";
import adminApi from "../../../api/admin.api";
import { formatCompactVnd, formatCurrency } from "../../../utils/formatCurrency";
import { useChartTokens } from "../../../utils/chartTokens";
import {
  buildRevenueSeries,
  summarizeSeries,
} from "../../../utils/dashboardMetrics";
import { ChartLegend, ChartSummary } from "../Common/ChartMeta";
import DateRangePicker from "../Common/DateRangePicker";

const toInputDate = (d) => d.toISOString().split("T")[0];

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-hover">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
        {label}
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

// Doanh thu hệ thống theo khoảng ngày: cột doanh thu + đường số đơn, có đường trung bình
const RevenueChart = () => {
  const now = new Date();
  // Mặc định nhìn dài hạn theo tháng; chọn khoảng ≤31 ngày trong DateRangePicker sẽ tự chuyển sang theo ngày
  const defaultStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [res, setRes] = useState({});
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(toInputDate(defaultStart));
  const [endDate, setEndDate] = useState(toInputDate(now));

  const fetchData = useCallback(async (start, end) => {
    setLoading(true);
    try {
      setRes(await adminApi.getRevenueStats(start, end));
    } catch (e) {
      console.error("Lỗi tải doanh thu:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    fetchData(start, end);
  };

  const series = useMemo(() => buildRevenueSeries(res), [res]);
  const summary = useMemo(() => summarizeSeries(series), [series]);
  const daily = res.is_daily ?? true;

  const chart = useChartTokens([
    "navy-600",
    "navy-300",
    "navy-200",
    "muted-foreground",
    "border",
    "accent",
  ]);
  const showLabels = series.length <= 14;

  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-5 shadow-card xl:col-span-2">
      <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600 dark:bg-navy-500/15 dark:text-navy-100">
            <TrendingUp className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Doanh thu hệ thống
            </h3>
            <p className="text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
              {daily ? "Theo ngày" : "Theo tháng"} ·{" "}
              {new Date(startDate).toLocaleDateString("vi-VN")} đến{" "}
              {new Date(endDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
        <DateRangePicker
          onChange={handleRangeChange}
          initialStart={startDate}
          initialEnd={endDate}
        />
      </div>

      <ChartLegend
        className="mb-2"
        series={[
          { label: "Doanh thu (trục trái)", color: chart["navy-600"] },
          {
            label: "Số đơn (trục phải)",
            color: chart["navy-300"],
            shape: "line",
          },
          {
            label: `Trung bình ${formatCompactVnd(summary.average)}`,
            color: chart["navy-200"],
            shape: "line",
          },
        ]}
      />

      <div className="relative h-72 w-full">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-card/70 backdrop-blur-[1px]">
            <RefreshCw className="h-6 w-6 animate-spin text-navy-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              Đang cập nhật…
            </span>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ComposedChart data={series} margin={{ top: 16, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid
              vertical={false}
              stroke={chart.border}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: chart.border }}
              tickLine={false}
              interval={series.length > 20 ? 3 : series.length > 12 ? 1 : 0}
              tick={{ fill: chart["muted-foreground"], fontSize: 11 }}
              dy={8}
            />
            <YAxis
              yAxisId="revenue"
              axisLine={false}
              tickLine={false}
              width={58}
              tick={{ fill: chart["muted-foreground"], fontSize: 11 }}
              tickFormatter={(val) => formatCompactVnd(val)}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              axisLine={false}
              tickLine={false}
              width={34}
              allowDecimals={false}
              tick={{ fill: chart["muted-foreground"], fontSize: 11 }}
            />
            <Tooltip
              content={<RevenueTooltip />}
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
              maxBarSize={26}
              animationDuration={700}
            >
              {showLabels && (
                <LabelList
                  dataKey="revenue"
                  position="top"
                  formatter={(val) => (val > 0 ? formatCompactVnd(val) : "")}
                  fill={chart["muted-foreground"]}
                  fontSize={10}
                  fontWeight={700}
                />
              )}
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

      <ChartSummary
        className="mt-4"
        items={[
          { label: "Tổng doanh thu", value: formatCompactVnd(summary.revenue), hint: formatCurrency(summary.revenue) },
          { label: "Đơn hàng", value: summary.orders, hint: `${series.length} ${daily ? "ngày" : "tháng"}` },
          { label: "Giá trị TB đơn", value: formatCompactVnd(summary.aov), hint: "AOV trong kỳ" },
          {
            label: "Kỳ cao nhất",
            value: formatCompactVnd(summary.peakRevenue),
            hint: `${summary.peakName} · ${summary.active}/${summary.total} kỳ có đơn`,
          },
        ]}
      />
    </div>
  );
};

export default RevenueChart;
