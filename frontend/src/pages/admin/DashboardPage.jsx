import React, { useEffect, useState } from 'react';
import {
    Users,
    ShoppingBag,
    DollarSign,
    CreditCard,
} from 'lucide-react';
import adminApi from '../../api/admin.api';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/admin/Common/AdminHeader';
import StatsGrid from '../../components/admin/Common/StatsGrid';
import RevenueChart from '../../components/admin/Dashboard/RevenueChart';
import OrderStatusPie from '../../components/admin/Dashboard/OrderStatusPie';
import RecentOrders from '../../components/admin/Dashboard/RecentOrders';
import OperationBrief from '../../components/admin/Dashboard/OperationBrief';

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

    const formatCurrency = (amt) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amt || 0);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-slate-100 rounded-3xl" />
                    <div className="h-96 bg-slate-100 rounded-3xl" />
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Doanh thu tháng này',
            value: formatCurrency(stats?.monthly_revenue),
            icon: DollarSign,
            trend: '+12.5%',
            trendColor: 'text-emerald-500',
            color: 'text-white',
            bg: 'bg-slate-900',
            dot: 'bg-amber-500',
            pulse: true,
            hist: [stats?.monthly_revenue * 0.8, stats?.monthly_revenue * 0.9, stats?.monthly_revenue * 0.85, stats?.monthly_revenue * 0.95, stats?.monthly_revenue * 1.1, stats?.monthly_revenue * 1.25],
            chartColor: '#F59E0B'
        },
        {
            label: 'Tổng đơn hàng',
            value: stats?.total_orders || 0,
            icon: ShoppingBag,
            trend: '+8.2%',
            trendColor: 'text-emerald-600',
            color: 'text-slate-900',
            bg: 'bg-white',
            dot: 'bg-blue-500',
            pulse: true,
            hist: [15, 18, 17, 20, 22, stats?.total_orders || 25],
            chartColor: '#3B82F6'
        },
        {
            label: 'Giá trị TB đơn (AOV)',
            value: formatCurrency(stats?.aov),
            icon: CreditCard,
            trend: '-2.4%',
            trendColor: 'text-rose-600',
            color: 'text-slate-900',
            bg: 'bg-white',
            dot: 'bg-emerald-500',
            hist: [1.2e6, 1.3e6, 1.25e6, 1.4e6, 1.35e6, stats?.aov || 1.3e6],
            chartColor: '#10B981'
        },
        {
            label: 'Tổng khách hàng',
            value: stats?.total_users || 0,
            icon: Users,
            trend: '+14.1%',
            trendColor: 'text-amber-100',
            color: 'text-white',
            bg: 'bg-amber-600',
            dot: 'bg-white',
            hist: [80, 85, 90, 95, 105, stats?.total_users || 120],
            chartColor: '#FEF3C7'
        },
    ];

    // Prepare chart data
    const revenueData = stats?.revenue_history?.map(h => ({
        name: `Tháng ${h.month}`,
        revenue: parseFloat(h.revenue)
    })) || [];

    const pieData = stats?.order_status_distribution?.map(s => ({
        name: s.status === 'pending' ? 'Chờ duyệt' :
            s.status === 'processing' ? 'Đang xử lý' :
                s.status === 'shipped' ? 'Đang giao' :
                    s.status === 'delivered' ? 'Thành công' :
                        s.status === 'cancelled' ? 'Đã hủy' : s.status,
        value: parseInt(s.count)
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
                <RevenueChart data={revenueData} formatCurrency={formatCurrency} />
                <OrderStatusPie data={pieData} totalOrders={stats?.total_orders} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders orders={stats?.recent_orders} navigate={navigate} formatCurrency={formatCurrency} />
                <OperationBrief lowStockProducts={stats?.low_stock_products} stats={stats} />
            </div>
        </div>
    );
};

export default DashboardPage;

