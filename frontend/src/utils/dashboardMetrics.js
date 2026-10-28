import { formatCurrency, formatCompactVnd } from "./formatCurrency";
import { ORDER_STATUS_LABELS } from "../constants/orderStatus";
import {
  CalendarCheck,
  Clock,
  PackageX,
  ShoppingBag,
  Tags,
  Users,
  Warehouse,
} from "lucide-react";

const pad2 = (n) => String(n).padStart(2, "0");

// % thay đổi so với kỳ trước. Kỳ trước = 0 thì không có cơ sở so sánh → null (ẩn badge),
// thay vì bịa "+100%" hay "-100%" như trước đây
export const computeTrend = (current, previous) => {
  if (!(previous > 0)) return null;
  const pct = ((current - previous) / previous) * 100;
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
};

// Mini-bar lấy số THỰC theo tháng (6 điểm gần nhất) từ history backend trả về
const monthlyValues = (rows, key) =>
  buildMonthlySeries(rows, 6).map((point) => point[key] || 0);

export const buildStatCards = (stats) => {
  const num = (key) => Number(stats?.[key]) || 0;
  const revenueHist = monthlyValues(stats?.revenue_history, "revenue");
  const orderHist = monthlyValues(stats?.revenue_history, "orders");
  const aovHist = orderHist.map((orders, i) =>
    orders > 0 ? revenueHist[i] / orders : 0,
  );
  const userHist = monthlyValues(stats?.user_growth_history, "count");

  return [
    {
      label: "Doanh thu tháng này",
      value: formatCurrency(num("monthly_revenue")),
      icon: CalendarCheck,
      trend: computeTrend(num("monthly_revenue"), num("last_month_revenue")),
      hint: `Tháng trước ${formatCurrency(num("last_month_revenue"))}`,
      hist: revenueHist,
      tone: "teal",
    },
    {
      label: "Đơn tháng này",
      value: num("orders_this_month"),
      icon: ShoppingBag,
      trend: computeTrend(num("orders_this_month"), num("last_month_orders")),
      hint: `${num("total_orders")} đơn toàn thời gian`,
      hist: orderHist,
      tone: "navy",
    },
    {
      label: "Giá trị TB đơn (AOV)",
      value: formatCurrency(num("aov")),
      icon: Warehouse,
      trend: computeTrend(num("aov"), num("last_month_aov")),
      hint: `Tháng trước ${formatCurrency(num("last_month_aov"))}`,
      hist: aovHist,
      tone: "violet",
    },
    {
      label: "Khách hàng mới",
      value: num("users_this_month"),
      icon: Users,
      trend: computeTrend(num("users_this_month"), num("users_last_month")),
      hint: `Tháng trước ${num("users_last_month")} khách`,
      hist: userHist,
      tone: "success",
    },
  ];
};

export const buildKpiItems = (stats) => {
  const num = (key) => Number(stats?.[key]) || 0;
  return [
    {
      label: "Đơn hôm nay",
      value: num("orders_today"),
      hint: `${num("orders_this_month")} đơn trong tháng`,
      icon: Clock,
    },
    {
      label: "Chờ duyệt",
      value: num("pending_orders"),
      hint: "Cần xử lý ngay",
      icon: ShoppingBag,
      tone: "warning",
    },
    {
      label: "Đơn thành công",
      value: num("total_orders"),
      hint: "Không tính đơn hủy/hoàn",
      icon: CalendarCheck,
      tone: "success",
    },
    {
      label: "Khách hàng",
      value: num("total_users"),
      hint: `${num("total_vouchers")} voucher đang có`,
      icon: Users,
      tone: "violet",
    },
    {
      label: "Giá trị tồn kho",
      value: formatCompactVnd(num("stock_value")),
      hint: `${num("stock_units")} sản phẩm trong kho`,
      icon: Tags,
      tone: "teal",
    },
    {
      label: "Hàng hết kho",
      value: num("out_of_stock_count"),
      hint: `${num("low_stock_count")} sản phẩm sắp hết`,
      icon: PackageX,
      tone: num("out_of_stock_count") > 0 ? "sale" : "success",
    },
  ];
};

export const buildPieData = (distribution) =>
  (distribution || []).map((s) => ({
    name: ORDER_STATUS_LABELS[s.status] ?? s.status,
    status: s.status,
    value: parseInt(s.count, 10) || 0,
  }));

const monthLabel = (m) => `Tháng ${m}`;

// Doanh thu/số đơn theo ngày trong N ngày gần nhất, ngày không có đơn = 0
export const buildDailySeries = (rows, days = 14, end = new Date()) => {
  const byKey = new Map(
    (rows || []).map((r) => [`${r.year}-${pad2(r.month)}-${pad2(r.day)}`, r]),
  );
  const out = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(end.getFullYear(), end.getMonth(), end.getDate() - i);
    const row = byKey.get(
      `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    );
    out.push({
      name: `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}`,
      revenue: parseFloat(row?.revenue) || 0,
      orders: parseInt(row?.orders, 10) || 0,
    });
  }
  return out;
};

// Series liên tục cho mọi khoảng thời gian: ≤62 ngày → theo ngày, dài hơn → theo tháng
export const buildRevenueSeries = (res) => {
  const rows = res?.revenue_history || [];
  const end = res?.end_date ? new Date(res.end_date) : new Date();
  const start = res?.start_date
    ? new Date(res.start_date)
    : new Date(end.getTime() - 180 * 86400000);
  const days = Math.max(1, Math.round((end - start) / 86400000) + 1);

  if (res?.is_daily || days <= 62) {
    return buildDailySeries(rows, Math.min(days, 62), end);
  }
  const months = Math.min(12, Math.max(2, Math.round(days / 30)));
  return buildMonthlySeries(rows, months).map((point) => ({
    ...point,
    name: point.name.replace("Tháng ", "T"),
  }));
};

// Cụm số tóm tắt một kỳ: tổng, đơn, AOV, đường trung bình, đỉnh kỳ
export const summarizeSeries = (series) => {
  const revenue = series.reduce((sum, p) => sum + p.revenue, 0);
  const orders = series.reduce((sum, p) => sum + p.orders, 0);
  const peak = series.reduce(
    (best, p) => (p.revenue > (best?.revenue ?? 0) ? p : best),
    series[0],
  );
  return {
    revenue,
    orders,
    aov: orders > 0 ? revenue / orders : 0,
    average: series.length > 0 ? revenue / series.length : 0,
    active: series.filter((p) => p.revenue > 0).length,
    total: series.length,
    peakName: peak?.name ?? "—",
    peakRevenue: peak?.revenue ?? 0,
  };
};

// Chuỗi 6 tháng gần nhất cho biểu đồ tăng trưởng (tháng trống = 0)
export const buildMonthlySeries = (rows, months = 6) => {
  const byKey = new Map(
    (rows || []).map((r) => [`${r.year}-${pad2(r.month)}`, r]),
  );
  const out = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const row = byKey.get(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}`);
    out.push({
      name: monthLabel(d.getMonth() + 1),
      count: parseInt(row?.count, 10) || 0,
      revenue: parseFloat(row?.revenue) || 0,
      orders: parseInt(row?.orders, 10) || 0,
    });
  }
  return out;
};

export const buildRevenueMix = (rows) => {
  const list = (rows || []).map((r) => ({
    name: r.name,
    revenue: parseFloat(r.revenue) || 0,
    units: parseInt(r.units, 10) || 0,
  }));
  const total = list.reduce((sum, item) => sum + item.revenue, 0);
  return list.map((item) => ({
    ...item,
    share: total > 0 ? Math.round((item.revenue / total) * 100) : 0,
  }));
};

// Phân bố đánh giá theo sao (5 → 1) kèm điểm trung bình
export const buildReviewSummary = (rows) => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  (rows || []).forEach((r) => {
    const star = Number(r.rating);
    if (counts[star] !== undefined) counts[star] = parseInt(r.count, 10) || 0;
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const weighted = Object.entries(counts).reduce(
    (sum, [star, count]) => sum + star * count,
    0,
  );
  return {
    total,
    average: total > 0 ? weighted / total : 0,
    bars: [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star],
      percent: total > 0 ? Math.round((counts[star] / total) * 100) : 0,
    })),
  };
};
