import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    CreditCard,
    User,
    MapPin,
    Phone,
    ChevronRight,
    Search,
    ShoppingBag,
    Calendar,
    Receipt,
    ShieldCheck,
    AlertCircle,
    XCircle
} from 'lucide-react';
import orderApi from '../../../api/order.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';

const STATUS_STEPS = [
    { key: 'pending', label: 'Chờ duyệt', icon: Clock, desc: 'Đơn hàng đang được hệ thống tiếp nhận.' },
    { key: 'confirmed', label: 'Xác nhận', icon: ShieldCheck, desc: 'Chronos đã xác nhận và đang chuẩn bị hàng.' },
    { key: 'processing', label: 'Xử lý', icon: Package, desc: 'Sản phẩm đang được kiểm định và đóng gói cao cấp.' },
    { key: 'shipping', label: 'Đang giao', icon: Truck, desc: 'Đơn hàng đang trên đường đến với bạn.' },
    { key: 'delivered', label: 'Hoàn thành', icon: CheckCircle2, desc: 'Tuyệt tác thời gian đã được bàn giao thành công.' }
];

const MyOrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const data = await orderApi.getOrderDetail(id);
            setOrder(data);
        } catch (error) {
            console.error("Lỗi lấy chi tiết đơn hàng:", error);
            toast.error("Không thể tải thông tin đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
        setCancelling(true);
        try {
            await orderApi.cancelOrder(id);
            toast.success('Đã hủy đơn hàng thành công');
            fetchOrderDetail();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi hủy đơn hàng');
        } finally {
            setCancelling(false);
        }
    };

    const handlePrint = () => window.print();

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] animate-pulse">Đang giải mã hành trình...</p>
            </div>
        );
    }

    if (!order) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-6 text-center">
            <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800">
                <AlertCircle className="h-10 w-10 text-zinc-300" />
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-serif text-zinc-900 dark:text-white">Kiệt tác chưa lộ diện</h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-light max-w-xs mx-auto text-sm">Chúng tôi không tìm thấy dữ liệu cho đơn hàng này trong hệ thống.</p>
            </div>
            <Button onClick={() => navigate('/orders')} variant="outline" className="rounded-2xl px-10 h-12 border-zinc-200 dark:border-zinc-800 hover:bg-amber-600 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest">
                Quay lại danh sách
            </Button>
        </div>
    );

    const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order.status);
    const isCancelled = order.status === 'cancelled';
    const isReturned = order.status === 'returned';

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-12 pb-32 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 print:hidden">
                    <div className="space-y-6">
                        <button
                            onClick={() => navigate('/orders')}
                            className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Quay lại lịch sử
                        </button>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="h-16 w-16 bg-zinc-900 dark:bg-zinc-100 rounded-[1.5rem] flex items-center justify-center text-amber-500 shadow-2xl relative">
                                <ShoppingBag className="h-8 w-8" />
                                <div className="absolute -top-2 -right-2 h-6 w-6 bg-amber-500 rounded-full border-4 border-zinc-50 dark:border-zinc-950"></div>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-medium text-zinc-900 dark:text-white tracking-tight">Đơn hàng #{order.id}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(order.created_at).toLocaleString('vi-VN')}</span>
                                    <div className="h-1 w-1 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 uppercase">{order.payment_method}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handlePrint} className="h-12 px-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm font-bold text-[10px] uppercase tracking-widest gap-2">
                            <Printer className="h-4 w-4" /> In biên lai
                        </Button>
                    </div>
                </div>

                {/* 1. SEAMLESS CONTAINER: Tracking Timeline */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl shadow-zinc-200/50 dark:shadow-none relative">
                    {isCancelled || isReturned ? (
                        <div className="flex flex-col items-center py-10 space-y-6 text-center">
                            <div className="h-20 w-20 bg-rose-500/10 rounded-full flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-rose-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif text-rose-600 uppercase tracking-widest">Hành trình đã dừng lại</h3>
                                <p className="text-zinc-500 text-sm font-light max-w-sm mx-auto">Đơn hàng này đã ở trạng thái {isCancelled ? 'Đã hủy' : 'Hoàn trả'}. Liên hệ chúng tôi nếu bạn cần hỗ trợ thêm.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-400 uppercase tracking-[0.3em] flex items-center justify-center gap-3 mb-10">
                                <Truck size={16} className="text-amber-500" />
                                Theo dõi hành trình sản phẩm
                            </h3>

                            <div className="relative flex justify-between">
                                {/* Connecting line */}
                                <div className="absolute top-[26px] left-[10%] right-[10%] h-[2px] bg-zinc-50 dark:bg-zinc-800 -z-0" />
                                <div
                                    className="absolute top-[26px] left-[10%] h-[2px] bg-amber-500 transition-all duration-1000 -z-0"
                                    style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 80}%` }}
                                />

                                {STATUS_STEPS.map((step, idx) => {
                                    const isDone = idx <= currentStepIdx;
                                    const isCurrent = idx === currentStepIdx;
                                    const StepIcon = step.icon;

                                    return (
                                        <div key={step.key} className="flex flex-col items-center gap-6 relative z-10 w-[20%] text-center group">
                                            <div className={cn(
                                                "h-14 w-14 rounded-full flex items-center justify-center border-[6px] border-white dark:border-zinc-900 shadow-xl transition-all duration-700",
                                                isDone ? "bg-amber-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400",
                                                isCurrent ? "scale-125 ring-8 ring-amber-500/10" : ""
                                            )}>
                                                <StepIcon size={22} className={isCurrent ? "animate-pulse" : ""} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest transition-colors",
                                                    isDone ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                                                )}>
                                                    {step.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-[9px] text-amber-600 dark:text-amber-500 font-bold italic leading-tight hidden md:block animate-in fade-in slide-in-from-top-1 duration-500">
                                                        {step.desc}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Decorative element */}
                    <div className="absolute -bottom-20 -right-20 p-4 opacity-[0.03] -z-0">
                        <Truck size={300} />
                    </div>
                </div>

                {/* 2. GRID LAYOUT: Order Details & Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT COLUMN: Products & Payment Summary */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Product Table */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                            <div className="px-10 py-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                                <h3 className="text-xl font-serif text-zinc-900 dark:text-white flex items-center gap-3">
                                    <Package size={20} className="text-amber-500" />
                                    Danh mục sản phẩm
                                </h3>
                                <div className="px-4 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                    {order.details?.length || 0} Sản phẩm
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-zinc-50/50 dark:bg-zinc-800/30">
                                            <th className="px-10 py-5 text-left text-[11px] font-black text-zinc-400 uppercase tracking-widest">Tuyệt tác</th>
                                            <th className="px-6 py-5 text-center text-[11px] font-black text-zinc-400 uppercase tracking-widest">Số lượng</th>
                                            <th className="px-10 py-5 text-right text-[11px] font-black text-zinc-400 uppercase tracking-widest">Giá sở hữu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                                        {order.details?.map((item) => (
                                            <tr key={item.id} className="group hover:bg-zinc-50/20 dark:hover:bg-zinc-800/20 transition-all duration-300">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="h-24 w-20 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                                                            <img
                                                                src={item.product?.image_url}
                                                                alt={item.product?.name}
                                                                className="h-full w-full object-cover p-2"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-amber-600 transition-colors">{item.product?.name}</p>
                                                            <p className="text-[10px] text-zinc-400 font-bold uppercase">Mã bộ máy: #{item.product?.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 text-center text-sm font-black text-zinc-900 dark:text-zinc-300">×{item.quantity}</td>
                                                <td className="px-10 py-8 text-right text-sm font-serif font-medium text-amber-600 dark:text-amber-500">{formatCurrency(item.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Calculation Area */}
                            <div className="p-10 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col items-end space-y-4">
                                <div className="w-full md:w-[350px] space-y-4">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-zinc-400 uppercase tracking-widest">Giá trị gốc:</span>
                                        <span className="text-zinc-900 dark:text-zinc-300">{formatCurrency(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-zinc-400 uppercase tracking-widest">Phí vận chuyển Chronos:</span>
                                        <span className="text-emerald-600 uppercase">
                                            {parseInt(order.shipping_fee) === 0 ? "MIỄN PHÍ" : formatCurrency(order.shipping_fee)}
                                        </span>
                                    </div>
                                    {parseFloat(order.discount_amount) > 0 && (
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-rose-400 uppercase tracking-widest">Đặc quyền giảm giá:</span>
                                            <span className="text-rose-600">-{formatCurrency(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-end mt-4">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Tổng đầu tư:</span>
                                        <span className="text-4xl font-serif text-zinc-900 dark:text-white font-medium leading-none tracking-tighter">
                                            {formatCurrency(order.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order History Log */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Clock size={16} className="text-amber-500" />
                                Nhật ký điều phối
                            </h3>
                            <div className="space-y-10 relative ml-4">
                                <div className="absolute left-[3px] top-6 bottom-0 w-[1px] bg-zinc-100 dark:bg-zinc-800" />
                                {order.history?.map((h, idx) => (
                                    <div key={idx} className="flex gap-8 items-start relative group">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full mt-2 relative z-10 transition-all group-hover:scale-150 duration-300",
                                            h.status === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500'
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase text-zinc-900 dark:text-white tracking-widest">{STATUS_STEPS.find(s => s.key === h.status)?.label || h.status}</span>
                                                <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-tighter">{new Date(h.created_at).toLocaleString('vi-VN')}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 font-light leading-relaxed italic">{h.note || "Kiện hàng của bạn đang được Chronos chăm sóc đúng quy trình."}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Recipient & Payment) */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* Recipient Card */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-sm space-y-8 overflow-hidden relative group">
                            <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-all duration-1000">
                                <User size={150} />
                            </div>
                            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-3 border-b border-zinc-50 dark:border-zinc-800 pb-4">
                                <User size={16} className="text-amber-500" />
                                Chủ sở hữu
                            </h3>
                            <div className="space-y-8 relative z-10">
                                <div className="flex gap-5">
                                    <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                        <User size={18} className="text-zinc-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Họ tên người nhận</p>
                                        <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase">{order.full_name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                        <Phone size={18} className="text-zinc-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Liên hệ di động</p>
                                        <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-widest">{order.phone_number}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                        <MapPin size={18} className="text-zinc-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Địa điểm bàn giao</p>
                                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-400 leading-relaxed uppercase">
                                            {order.address_line}{order.ward ? `, ${order.ward}` : ''}{order.district ? `, ${order.district}` : ''}{order.city ? `, ${order.city}` : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Actions */}
                        <div className="bg-zinc-900 dark:bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                            <h3 className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <Receipt size={16} className="text-amber-500" />
                                Tài chính & Hành động
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-zinc-800 dark:bg-zinc-50 p-5 rounded-2xl border border-white/5 dark:border-zinc-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Phương thức</span>
                                        <span className="text-xs font-bold text-white dark:text-zinc-900 uppercase">{order.payment_method}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trạng thái</span>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                                            order.payment_status === 'paid' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                        )}>
                                            {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                                        </span>
                                    </div>
                                </div>

                                {order.status === 'pending' && (
                                    <div className="pt-4">
                                        <button
                                            onClick={handleCancelOrder}
                                            disabled={cancelling}
                                            className="w-full h-12 rounded-2xl border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group"
                                        >
                                            <XCircle size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                                            {cancelling ? 'Đang thực hiện...' : 'Yêu cầu hủy đơn hàng'}
                                        </button>
                                        <p className="text-[9px] text-zinc-600 dark:text-zinc-400 mt-4 text-center italic font-bold">
                                            Chỉ có thể hủy khi đơn hàng ở trạng thái chờ duyệt.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 1cm; size: A4; }
                    body { background: white !important; font-family: sans-serif; color: black !important; }
                    header, footer, nav, button, .print-hidden { display: none !important; }
                    .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    .bg-white, .bg-zinc-50, .bg-zinc-900 { background: transparent !important; box-shadow: none !important; border: 1px solid #eee !important; border-radius: 0 !important; }
                    .text-white, .text-zinc-400 { color: black !important; }
                    .grid { display: block !important; }
                    .lg\\:col-span-8, .lg\\:col-span-4 { width: 100% !important; margin-bottom: 2rem; border: none !important; }
                    table { border: 1px solid #000; border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #eee !important; padding: 10px !important; }
                    .text-4xl { font-size: 24pt !important; }
                }
            `}} />
        </div>
    );
};

export default MyOrderDetailPage;
