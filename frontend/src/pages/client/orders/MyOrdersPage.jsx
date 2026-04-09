import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Package,
    Calendar,
    CreditCard,
    Search,
    ShoppingBag,
    ArrowRight,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    AlertCircle
} from 'lucide-react';
import orderApi from '../../../api/order.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';

const STATUS_MAP = {
    pending: { label: 'Chờ xác nhận', color: 'text-amber-600 dark:text-amber-500', border: 'border-amber-200 dark:border-amber-900/50', icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: 'text-blue-600 dark:text-blue-500', border: 'border-blue-200 dark:border-blue-900/50', icon: CheckCircle2 },
    processing: { label: 'Đang xử lý', color: 'text-zinc-600 dark:text-zinc-600', border: 'border-zinc-200 dark:border-zinc-700', icon: Package },
    shipping: { label: 'Đang giao hàng', color: 'text-zinc-800 dark:text-zinc-300', border: 'border-zinc-300 dark:border-zinc-600', icon: Truck },
    delivered: { label: 'Hoàn tất', color: 'text-emerald-600 dark:text-emerald-500', border: 'border-emerald-200 dark:border-emerald-900/50', icon: CheckCircle2 },
    cancelled: { label: 'Đã hủy', color: 'text-rose-600 dark:text-rose-500', border: 'border-rose-200 dark:border-rose-900/50', icon: XCircle }
};

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getMyOrders();
            setOrders(response.data || response);
        } catch (error) {
            console.error('Lỗi lấy danh sách đơn hàng:', error);
            toast.error('Không thể tải lịch sử đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-zinc-50 dark:bg-zinc-950">
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-16 h-16 border-l-2 border-amber-600 rounded-full animate-spin"></div>
                    <Clock size={24} className="text-zinc-300 dark:text-zinc-700" />
                </div>
                <p className="text-xs font-medium  text-zinc-600 uppercase">Đang tải hồ sơ...</p>
            </div>
        );
    }

    return (
        <div className=" bg-zinc-50 dark:bg-zinc-950 pt-6 pb-6 px-6 md:px-8 font-sans selection:bg-amber-500/30">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header Page - Editorial Style */}
                <div className="text-center space-y-6">
                    <span className="text-xs font-semibold  text-amber-600 dark:text-amber-500 uppercase">
                        The Chronos Archives
                    </span>
                    <h1 className="text-4xl md:text-6xl text-zinc-900 dark:text-white leading-tight mb-2">
                        Hồ Sơ <span className="italic font-light text-zinc-700 dark:text-zinc-600">Sở Hữu</span>
                    </h1>
                    <div className="h-px w-32 bg-gradient-to-b from-amber-500 to-transparent mx-auto mt-2 mb-2"></div>
                    <p className="text-zinc-700 dark:text-zinc-600 font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Lưu giữ dấu ấn của những tuyệt tác vi cơ học mà bạn đã lựa chọn để đồng hành cùng thời gian.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-amber-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã đơn hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-all placeholder:text-zinc-600 shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-8 text-center">
                        <div>
                            <p className="text-2xl text-zinc-900 dark:text-white">{orders.length}</p>
                            <p className="text-[10px]  text-zinc-700 uppercase mt-1">Tuyệt tác</p>
                        </div>
                    </div>
                </div>

                {/* Order List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200 dark:border-zinc-800">
                        <ShoppingBag size={48} strokeWidth={1} className="mx-auto mb-6 text-zinc-300 dark:text-zinc-700" />
                        <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-3">Hồ sơ trống</h3>
                        <p className="text-zinc-700 dark:text-zinc-600 font-light mb-8 max-w-sm mx-auto text-sm">
                            Hành trình kiến tạo phong cách thượng lưu của bạn chưa bắt đầu.
                        </p>
                        <Link
                            to="/products"
                            className="group inline-flex items-center gap-4 text-xs font-semibold  uppercase text-amber-600 dark:text-amber-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            Khám phá bộ sưu tập
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'text-zinc-700', border: 'border-zinc-200', icon: AlertCircle };

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-sm p-4 md:p-6 hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-colors duration-500 group"
                                >
                                    {/* Top Section: Meta Info - Redesigned to show Product first */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-6 flex-1">
                                            {/* Primary Product Image */}
                                            <div className="h-24 w-24 md:h-28 md:w-28 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-3 shrink-0 rounded-sm group-hover:border-amber-500/50 transition-colors duration-500">
                                                <img
                                                    src={order.details?.[0]?.product?.image_url}
                                                    alt={order.details?.[0]?.product?.name}
                                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase ">
                                                        Tuyệt tác sở hữu
                                                    </p>
                                                    {order.details?.length > 1 && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 rounded-full font-bold">
                                                            +{order.details.length - 1} sản phẩm khác
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-xl md:text-2xl font-serif text-zinc-900 dark:text-white leading-tight">
                                                    {order.details?.[0]?.product?.name || "Sản phẩm Chronos"}
                                                </h4>
                                                <p className="text-[10px] text-zinc-600 uppercase  font-medium">
                                                    Mã Hồ Sơ: <span className="text-zinc-700 dark:text-zinc-300">#{order.id}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-bold  uppercase border bg-transparent",
                                                statusInfo.border, statusInfo.color
                                            )}>
                                                <statusInfo.icon className="w-3.5 h-3.5" />
                                                {statusInfo.label}
                                            </span>

                                            <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase ">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span className="w-px h-3 bg-zinc-200 dark:bg-zinc-800"></span>
                                                <span className="flex items-center gap-1.5">
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                    {order.payment_method}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Section: Items & Total */}
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                        {/* Remaining Products Preview if any */}
                                        <div className="w-full md:w-auto">
                                            {order.details?.length > 1 && (
                                                <div className="space-y-4">
                                                    <p className="text-[12px] text-zinc-600 uppercase font-black">Các sản phẩm đi kèm</p>
                                                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                                                        {order.details.slice(1, 5).map((item, idx) => (
                                                            <div key={idx} className="h-14 w-14 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-1.5 shrink-0 rounded-sm opacity-60 hover:opacity-100 transition-opacity">
                                                                <img
                                                                    src={item.product?.image_url}
                                                                    alt="Additional item"
                                                                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                                                />
                                                            </div>
                                                        ))}
                                                        {order.details.length > 5 && (
                                                            <div className="h-14 w-14 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shrink-0 rounded-sm">
                                                                <span className="text-[10px] font-bold text-zinc-600">+{order.details.length - 5}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Total & Action */}
                                        <div className="w-full md:w-auto flex flex-row items-center justify-between md:justify-end gap-10">
                                            <div className="text-left md:text-right">
                                                <p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Giá trị đơn hàng</p>
                                                <p className="text-xl md:text-2xl text-rose-500 font-bold dark:text-white">
                                                    {formatCurrency(order.total_amount)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                className="group/btn h-12 px-6 flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold  uppercase hover:bg-amber-600 dark:hover:bg-amber-600 hover:text-white transition-all rounded-sm shadow-lg shadow-zinc-200 dark:shadow-none"
                                            >
                                                Thông tin chi tiết
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;