import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Package, 
    ChevronRight, 
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
    pending: { label: 'Chờ xác nhận', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: CheckCircle2 },
    processing: { label: 'Đang xử lý', color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Package },
    shipping: { label: 'Đang giao hàng', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Truck },
    delivered: { label: 'Hoàn tất', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
    cancelled: { label: 'Đã hủy', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: XCircle }
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
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-400 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Đang tải hành trình của bạn...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-12 pb-24 px-6 md:px-8">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header Page */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-zinc-900 dark:text-white tracking-tight">Hành trình Sở hữu</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Theo dõi dấu ấn của những tuyệt tác thời gian bạn đã chọn từ bộ sưu tập Chronos.
                    </p>
                    <div className="h-px w-24 bg-amber-500/30 mx-auto mt-8"></div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm mã đơn hàng..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <span>Tổng cộng:</span>
                        <span className="text-amber-500 text-sm">{orders.length} Đơn hàng</span>
                    </div>
                </div>

                {/* Order List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                        <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <ShoppingBag className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-serif text-zinc-900 dark:text-white mb-2">Chưa có lịch sử giao dịch</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 font-light mb-8 max-w-xs mx-auto text-sm">Hãy bắt đầu hành trình của bạn bằng việc khám phá các dòng đồng hồ cao cấp của chúng tôi.</p>
                        <Link 
                            to="/products"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-xl hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white transition-all font-bold text-xs uppercase tracking-widest group shadow-xl shadow-zinc-200/20"
                        >
                            Khám phá ngay
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredOrders.map((order) => {
                            const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: 'text-zinc-500', bg: 'bg-zinc-500/10', icon: AlertCircle };
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div 
                                    key={order.id}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 md:p-10 hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all duration-500 group relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/5 group-hover:scale-110 transition-transform duration-500">
                                                <Package className="w-8 h-8 text-amber-600 dark:text-amber-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white">#{order.id}</h4>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-transparent",
                                                        statusInfo.bg, statusInfo.color
                                                    )}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    <span className="h-1 w-1 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                                                    <span className="flex items-center gap-1.5">
                                                        <CreditCard className="w-3 h-3" />
                                                        {order.payment_method?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Tổng giá trị</p>
                                            <p className="text-3xl font-serif text-amber-600 dark:text-amber-500 font-medium leading-none">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items Preview (Simulated if details not in list) */}
                                    {order.order_details && (
                                        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none relative z-10">
                                            {order.order_details.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="h-16 w-14 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 p-1 shrink-0 overflow-hidden shadow-sm">
                                                    <img src={item.product?.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                                                </div>
                                            ))}
                                            {order.order_details.length > 4 && (
                                               <div className="h-16 w-14 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shrink-0">
                                                   <span className="text-xs font-bold text-zinc-400">+{order.order_details.length - 4}</span>
                                               </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between border-t border-zinc-50 dark:border-zinc-800 pt-8 relative z-10">
                                        <div className="hidden md:flex items-center gap-4">
                                            <div className={cn("h-2 w-2 rounded-full animate-pulse", statusInfo.bg.replace('/10', ''))} />
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                                                {order.status === 'delivered' ? 'Cảm ơn bạn đã tin tưởng Chronos' : 'Đang xử lý đúng quy trình cao cấp'}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                            className="w-full md:w-auto h-12 px-10 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                                        >
                                            Theo dõi hành trình
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Decorative background element */}
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 -z-0">
                                        <Package size={200} />
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
