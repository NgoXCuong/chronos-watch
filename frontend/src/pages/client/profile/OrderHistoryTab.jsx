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
            default: return 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20';
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
                <p className="text-zinc-600 animate-pulse">Đang tải đơn hàng...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-3xl border border-zinc-200 dark:border-zinc-800/50 border-dashed">
                <Package className="w-16 h-16 text-zinc-600 dark:text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-2 font-medium">Chưa có đơn hàng nào</h3>
                <p className="text-zinc-700 font-light max-w-xs mx-auto">Hãy khám phá bộ sưu tập đồng hồ tinh tế của chúng tôi và đặt đơn hàng đầu tiên.</p>
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
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Editorial Header Section - Optimized Spacing */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-zinc-200 dark:border-zinc-800/60">
                <div className="space-y-2">
                    <span className="text-[12px] font-black  text-amber-600 dark:text-amber-500 uppercase">
                        The Archive Registry
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-light text-zinc-900 dark:text-white ">
                        Lịch Sử <span className="italic text-zinc-600 dark:text-zinc-700">Sở Hữu</span>
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => {
                    const firstItem = order.details?.[0]?.product;
                    return (
                        <div
                            key={order.id}
                            className="group relative flex flex-col md:flex-row gap-6 bg-white dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800 pb-6 last:border-0 hover:border-amber-500/30 transition-all duration-700 overflow-hidden"
                        >
                            {/* Product Preview Image - Compact */}
                            <div className="w-full md:w-24 h-24 shrink-0 bg-zinc-50 dark:bg-zinc-950 rounded-sm overflow-hidden border border-zinc-100 dark:border-zinc-800 p-1.5 group-hover:border-amber-500/30 transition-all duration-700">
                                {firstItem?.image_url ? (
                                    <img
                                        src={firstItem.image_url}
                                        alt={firstItem.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-8 h-8 text-zinc-200 dark:text-zinc-800" />
                                    </div>
                                )}
                            </div>

                            {/* Order Info - Tightened */}
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[12px] font-black text-amber-600 uppercase ">OWNERSHIP ID</span>
                                            <span className="text-[12px] text-zinc-600 dark:text-zinc-700 font-light">#{order.id}</span>
                                        </div>
                                        <h4 className="text-lg font-serif text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                            {firstItem?.name || "Chi tiết đơn hàng"}
                                        </h4>
                                        {order.details?.length > 1 && (
                                            <p className="text-[12px] text-zinc-600 italic">+{order.details.length - 1} vật phẩm khác</p>
                                        )}
                                    </div>

                                    <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-black uppercase  border ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 pt-2">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-zinc-600 font-bold">Thời điểm</p>
                                        <p className="text-[11px] text-zinc-600 dark:text-zinc-600">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-zinc-600 font-bold">Giá trị</p>
                                        <p className="text-[11px] font-medium text-zinc-900 dark:text-white">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                                        </p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-zinc-600 font-bold">Phương thức</p>
                                        <p className="text-[11px] text-zinc-700 font-bold uppercase ">{order.payment_method}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => window.location.href = `/orders/${order.id}`}
                                    className="inline-flex items-center gap-2 group/link text-[12px] font-black uppercase  text-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-all pb-1"
                                >
                                    Chi tiết
                                    <ChevronRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderHistoryTab;
