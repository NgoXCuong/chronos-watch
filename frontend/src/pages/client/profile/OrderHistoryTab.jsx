import React, { useState, useEffect } from 'react';
import { Package, ExternalLink, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import orderApi from '../../../api/order.api';
import { toast } from 'sonner';

const OrderHistoryTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderApi.getMyOrders();
                setOrders(response.data || response);
            } catch (error) {
                console.error('Fetch orders error:', error);
                toast.error('Không thể tải lịch sử đơn hàng');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'shipping': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Đã xác nhận';
            case 'shipping': return 'Đang giao hàng';
            case 'delivered': return 'Đã giao hàng';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-400 animate-pulse">Đang tải đơn hàng...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 border-dashed">
                <Package className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-2 font-medium">Chưa có đơn hàng nào</h3>
                <p className="text-zinc-500 font-light max-w-xs mx-auto">Hãy khám phá bộ sưu tập đồng hồ tinh tế của chúng tôi và đặt đơn hàng đầu tiên.</p>
                <button
                    onClick={() => window.location.href = '/products'}
                    className="mt-6 px-8 py-3 bg-zinc-900 dark:bg-zinc-800 hover:bg-amber-600 text-white rounded-xl transition-colors font-medium shadow-lg shadow-zinc-200/50 dark:shadow-none"
                >
                    Đến cửa hàng
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-serif font-medium text-zinc-900 dark:text-white mb-6">Lịch sử giao dịch</h2>

            <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all group shadow-sm hover:shadow-md dark:shadow-none"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/10 rounded-xl">
                                    <Package className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-zinc-900 dark:text-white font-medium">Đơn hàng #{order.id}</h4>
                                    <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            </div>

                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-[0.1em] ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </div>
                        </div>

                        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Tổng cộng</p>
                                <p className="text-xl font-serif text-amber-600 dark:text-amber-500 font-medium">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-medium`}>
                                    <CreditCard className="w-4 h-4" />
                                    {order.payment_method?.toUpperCase()}
                                </span>
                                <button
                                    onClick={() => window.location.href = `/orders/${order.id}`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-amber-600 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                                >
                                    Chi tiết
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistoryTab;
