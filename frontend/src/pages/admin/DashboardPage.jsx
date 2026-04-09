import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, DollarSign, CreditCard } from "lucide-react";
import adminApi from "../../api/admin.api";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/Common/AdminHeader";
import StatsGrid from "../../components/admin/Common/StatsGrid";
import RevenueChart from "../../components/admin/Dashboard/RevenueChart";
import OrderStatusPie from "../../components/admin/Dashboard/OrderStatusPie";
import RecentOrders from "../../components/admin/Dashboard/RecentOrders";
import OperationBrief from "../../components/admin/Dashboard/OperationBrief";
import { formatCurrency } from "../../utils/formatCurrency.js";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboard();
        setStats(data);
      } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  //   const formatCurrency = (amt) =>
  //     new Intl.NumberFormat("vi-VN", {
  //       style: "currency",
  //       currency: "VND",
  //     }).format(amt || 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-3xl" />
          <div className="h-96 bg-slate-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Tính % tăng giảm thực tế so với tháng trước
  const computeTrend = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? '+100%' : '0%';
    const pct = ((current - previous) / previous) * 100;
    return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
  };
  const trendColor = (current, previous, reverse = false) => {
    if (!previous || previous === 0) return "bg-slate-100 text-slate-400 border-slate-200/50";
    const up = current >= previous;
    const isPositive = reverse ? !up : up;
    return isPositive
      ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
      : "bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]";
  };

  const statCards = [
    {
      label: "Doanh thu tháng này",
      value: formatCurrency(stats?.monthly_revenue),
      icon: DollarSign,
      trend: computeTrend(stats?.monthly_revenue, stats?.last_month_revenue),
      trendColor: trendColor(stats?.monthly_revenue, stats?.last_month_revenue),
      color: "text-white",
      bg: "bg-slate-900",
      dot: "bg-amber-500",
      pulse: true,
      hist: [
        stats?.last_month_revenue * 0.7,
        stats?.last_month_revenue * 0.85,
        stats?.last_month_revenue * 0.9,
        stats?.last_month_revenue,
        stats?.monthly_revenue * 0.85,
        stats?.monthly_revenue,
      ],
      chartColor: "#F59E0B",
    },
    {
      label: "Tổng đơn hàng",
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
      trend: computeTrend(stats?.total_orders, stats?.last_month_orders),
      trendColor: trendColor(stats?.total_orders, stats?.last_month_orders),
      color: "text-slate-900",
      bg: "bg-white",
      dot: "bg-blue-500",
      pulse: true,
      hist: [stats?.last_month_orders * 0.6, stats?.last_month_orders * 0.8, stats?.last_month_orders, stats?.total_orders * 0.7, stats?.total_orders * 0.9, stats?.total_orders || 0],
      chartColor: "#3B82F6",
    },
    {
      label: "Giá trị TB đơn (AOV)",
      value: formatCurrency(stats?.aov),
      icon: CreditCard,
      trend: computeTrend(stats?.aov, stats?.last_month_aov),
      trendColor: trendColor(stats?.aov, stats?.last_month_aov),
      color: "text-slate-900",
      bg: "bg-white",
      dot: "bg-emerald-500",
      hist: [stats?.last_month_aov * 0.8, stats?.last_month_aov * 0.9, stats?.last_month_aov, stats?.aov * 0.8, stats?.aov * 0.9, stats?.aov || 0],
      chartColor: "#10B981",
    },
    {
      label: "Khách hàng mới",
      value: stats?.users_this_month || 0,
      icon: Users,
      trend: computeTrend(stats?.users_this_month, stats?.users_last_month),
      trendColor: trendColor(stats?.users_this_month, stats?.users_last_month),
      color: "text-white",
      bg: "bg-amber-600",
      dot: "bg-white",
      hist: [stats?.users_last_month * 0.7, stats?.users_last_month * 0.85, stats?.users_last_month, stats?.users_this_month * 0.8, stats?.users_this_month * 0.95, stats?.users_this_month || 0],
      chartColor: "#FEF3C7",
    },
  ];

  // Prepare chart data
  const revenueData =
    stats?.revenue_history?.map((h) => ({
      name: `Tháng ${h.month}`,
      revenue: parseFloat(h.revenue),
    })) || [];

  const pieData =
    stats?.order_status_distribution?.map((s) => ({
      name:
        s.status === "pending"
          ? "Chờ duyệt"
          : s.status === "processing"
            ? "Đang xử lý"
            : s.status === "shipped"
              ? "Đang giao"
              : s.status === "delivered"
                ? "Thành công"
                : s.status === "cancelled"
                  ? "Đã hủy"
                  : s.status,
      value: parseInt(s.count),
    })) || [];

  return (
    <div className="space-y-6 pb-10 font-roboto">
      <AdminHeader
        title="Tổng quan hệ thống"
        subtitle="Chào mừng trở lại! Đây là tóm tắt hoạt động kinh doanh hôm nay."
        showDate
      />

      <StatsGrid stats={statCards} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <OrderStatusPie data={pieData} totalOrders={stats?.total_orders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders
          orders={stats?.recent_orders}
          navigate={navigate}
          formatCurrency={formatCurrency}
        />
        <OperationBrief
          lowStockProducts={stats?.low_stock_products}
          stats={stats}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
