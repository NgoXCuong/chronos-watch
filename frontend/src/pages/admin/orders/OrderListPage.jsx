import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    FileSpreadsheet
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import adminApi from '../../../api/admin.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import AdminHeader from '../../../components/admin/Common/AdminHeader';
import SearchBanner from '../../../components/admin/Common/SearchBanner';
import OrderTable, { STATUS_CONFIG } from '../../../components/admin/Order/OrderTable';
import OrderStatusFilter from '../../../components/admin/Order/OrderStatusFilter';
import { cn } from '../../../lib/utils';

const STATUSES = Object.entries(STATUS_CONFIG).map(([k, v]) => ({ key: k, label: v.label }));

const OrderListPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAllOrders();
            setOrders(data);
        } catch {
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusUpdate = async (orderId, status) => {
        setUpdatingId(orderId);
        try {
            await adminApi.updateOrderStatus(orderId, status);
            toast.success(`Đã cập nhật trạng thái: ${STATUS_CONFIG[status]?.label}`);
            fetchOrders();
        } catch (err) {
            toast.error(err?.message || 'Không thể cập nhật trạng thái');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleExportExcel = () => {
        if (orders.length === 0) {
            toast.error("Không có dữ liệu để xuất");
            return;
        }

        const exportData = orders.map(o => ({
            "Mã Đơn": `#${o.id}`,
            "Khách Hàng": o.user?.username || 'Khách vãng lai',
            "Email": o.user?.email || 'N/A',
            "Ngày Đặt": new Date(o.created_at).toLocaleString('vi-VN'),
            "Tổng Tiền": o.total_amount,
            "Phương Thức": o.payment_method?.toUpperCase(),
            "Trạng Thái": STATUS_CONFIG[o.status]?.label || o.status
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");
        XLSX.writeFile(wb, `Chronos_Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success("Đã xuất file Excel thành công!");
    };

    const formatCurrency = (amt) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amt || 0);

    const filtered = orders.filter(o => {
        if (filterStatus && o.status !== filterStatus) return false;
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            return String(o.id).includes(q) || o.user?.username?.toLowerCase().includes(q) || o.user?.email?.toLowerCase().includes(q);
        }
        return true;
    });

    const counts = STATUSES.reduce((acc, { key }) => {
        acc[key] = orders.filter(o => o.status === key).length;
        return acc;
    }, {});

    return (
        <div className="space-y-6 pb-10 font-roboto">
            <AdminHeader
                title="Quản lý Đơn hàng"
                subtitle="Theo dõi và xử lý vận hành giao hàng"
                actions={
                    <>
                        {/* EXPORT EXCEL */}
                        <Button
                            onClick={handleExportExcel}
                            className="gap-2 h-11 px-5 rounded-2xl 
                           bg-emerald-500 text-white 
                           font-bold text-xs uppercase 
                           shadow-md shadow-emerald-500/20
                           hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30
                           active:scale-95 transition-all"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            Xuất Excel
                        </Button>
                    </>
                }
            />

            <SearchBanner
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Tìm theo mã đơn, khách hàng, email..."
                onRefresh={fetchOrders}
                loading={loading}
            >
                <div className="h-8 w-px bg-slate-100 mx-2 hidden lg:block" />
                <OrderStatusFilter
                    activeStatus={filterStatus}
                    onStatusChange={setFilterStatus}
                    totalCount={orders.length}
                    counts={counts}
                    statuses={STATUSES}
                />
            </SearchBanner>

            <OrderTable
                orders={filtered}
                loading={loading}
                onStatusUpdate={handleStatusUpdate}
                onView={(id) => navigate(`/admin/orders/${id}`)}
                formatCurrency={formatCurrency}
                updatingId={updatingId}
            />
        </div>
    );
};

export default OrderListPage;
