import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/Common/AdminHeader";
import StatsGrid from "../../components/admin/Common/StatsGrid";
import RevenueChart from "../../components/admin/Dashboard/RevenueChart";
import OrderStatusPie from "../../components/admin/Dashboard/OrderStatusPie";
import TopSellingProducts from "../../components/admin/Dashboard/TopSellingProducts";
import OperationBrief from "../../components/admin/Dashboard/OperationBrief";
import KpiStrip from "../../components/admin/Dashboard/KpiStrip";
import DailyTrendChart from "../../components/admin/Dashboard/DailyTrendChart";
import RevenueMixChart from "../../components/admin/Dashboard/RevenueMixChart";
import UserGrowthChart from "../../components/admin/Dashboard/UserGrowthChart";
import ReviewPulse from "../../components/admin/Dashboard/ReviewPulse";
import RecentOrdersPanel from "../../components/admin/Dashboard/RecentOrdersPanel";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import {
  buildKpiItems,
  buildPieData,
  buildRevenueMix,
  buildStatCards,
} from "../../utils/dashboardMetrics";

const DashboardSkeleton = () => (
  <div className="space-y-3">
    <div className="h-20 animate-pulse rounded-xl bg-muted" />
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
      <div className="h-96 animate-pulse rounded-xl bg-muted xl:col-span-2" />
      <div className="h-96 animate-pulse rounded-xl bg-muted" />
    </div>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-3 pb-10">
      <AdminHeader
        title="Tổng quan hệ thống"
        subtitle="Doanh thu, đơn hàng, khách hàng và tồn kho theo thời gian thực."
        className="mb-5"
      />

      <StatsGrid stats={buildStatCards(stats)} />
      <KpiStrip items={buildKpiItems(stats)} />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <RevenueChart />
        <OrderStatusPie data={buildPieData(stats?.order_status_distribution)} />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <DailyTrendChart className="xl:col-span-2" />
        <RevenueMixChart
          byCategory={buildRevenueMix(stats?.revenue_by_category)}
          byBrand={buildRevenueMix(stats?.revenue_by_brand)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <RecentOrdersPanel
          orders={stats?.recent_orders}
          className="xl:col-span-2"
        />
        <UserGrowthChart history={stats?.user_growth_history} />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <TopSellingProducts
          products={stats?.top_selling_products}
          navigate={navigate}
        />
        <OperationBrief
          lowStockProducts={stats?.low_stock_products}
          stats={stats}
        />
        <ReviewPulse
          distribution={stats?.review_distribution}
          className="lg:col-span-2 xl:col-span-1"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
