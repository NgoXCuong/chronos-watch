import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Printer, Package, Truck, CheckCircle2,
    XCircle, Clock, CreditCard, User, MapPin,
    Phone, Mail, ChevronRight, Hash, Calendar,
    AlertCircle, Receipt, ShoppingBag, Info
} from 'lucide-react';
import adminApi from '../../../api/admin.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';

const STATUS_STEPS = [
    { key: 'pending', label: 'Chờ duyệt', icon: Clock },
    { key: 'confirmed', label: 'Xác nhận', icon: CheckCircle2 },
    { key: 'processing', label: 'Xử lý', icon: Package },
    { key: 'shipping', label: 'Đang giao', icon: Truck },
    { key: 'delivered', label: 'Hoàn thành', icon: CheckCircle2 }
];

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getOrderDetail(id);
            setOrder(data);
        } catch (error) {
            console.error("Lỗi lấy chi tiết đơn hàng:", error);
            toast.error("Không thể tải thông tin đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await adminApi.updateOrderStatus(id, newStatus, note);
            toast.success(`Đã chuyển sang trạng thái: ${getStatusLabel(newStatus)}`);
            setNote('');
            fetchOrderDetail();
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật trạng thái");
        } finally {
            setUpdating(false);
        }
    };

    const handleMarkAsPaid = async () => {
        setUpdating(true);
        try {
            await adminApi.markOrderAsPaid(id);
            toast.success(order?.payment_method === 'cod' ? 'Đã xác nhận thu tiền COD thành công!' : 'Đã xác nhận thanh toán chuyển khoản thành công!');
            fetchOrderDetail();
        } catch (error) {
            toast.error(error?.message || 'Lỗi xác nhận thanh toán');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusLabel = (status) => {
        return STATUS_STEPS.find(s => s.key === status)?.label || status;
    };

    const handlePrint = () => window.print();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
                <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!order) return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
            <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <AlertCircle className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Không tìm thấy đơn hàng</h3>
            <Button onClick={() => navigate('/admin/orders')} variant="outline" className="rounded-2xl px-8 border-slate-200">Quay lại</Button>
        </div>
    );

    const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order.status);

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-32 font-roboto animate-in fade-in duration-500">
            {/* 1. Header (Integrated Title & Actions) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="h-10 w-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Đơn hàng #{order.id}
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-1">
                            <span>Quản trị đơn hàng</span>
                            <ChevronRight size={12} />
                            <span className="text-slate-900 font-bold">{getStatusLabel(order.status)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handlePrint} className="h-11 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase gap-2 transition-all shadow-sm">
                        <Printer className="h-4 w-4" /> In hóa đơn
                    </Button>
                </div>
            </div>

            {/* 2. Main Integrated Layout Container */}
            <div className="bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-slate-200/20 overflow-hidden min-h-[800px]">

                {/* 2.1 Top Metadata Bar (Seamless) */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100">
                    <div className="p-6 border-r border-slate-100 flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian đặt</span>
                        <span className="text-sm font-bold text-slate-900">{new Date(order.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="p-6 border-r border-slate-100 flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phương thức thanh toán</span>
                        <span className="text-sm font-bold text-slate-900 uppercase">{order.payment_method || 'N/A'}</span>
                    </div>
                    <div className="p-6 border-r border-slate-100 flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái thanh toán</span>
                        <span className={cn(
                            "text-xs font-black uppercase px-3 py-1 rounded-full inline-block w-fit mt-1",
                            order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        )}>
                            {order.payment_status === 'paid' ? 'Đã thu tiền' : 'Chờ xử lý'}
                        </span>
                    </div>
                    <div className="p-6 flex flex-col gap-1 bg-slate-50/30">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng giá trị đơn</span>
                        <span className="text-xl font-price font-black text-amber-600 leading-none">{formatCurrency(order.total_amount)}</span>
                    </div>
                </div>

                {/* 2.2 Status Stepper (Integrated) */}
                <div className="px-10 py-10 bg-slate-50/20 border-b border-slate-100 overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[700px] relative">
                        {/* Connecting Line */}
                        <div className="absolute top-[20px] left-[5%] right-[5%] h-[2px] bg-slate-100 -z-0" />
                        <div
                            className="absolute top-[20px] left-[5%] h-[2px] bg-amber-500 transition-all duration-1000 -z-0"
                            style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 90}%` }}
                        />

                        {STATUS_STEPS.map((step, idx) => {
                            const isCompleted = idx < currentStepIdx;
                            const isActive = idx === currentStepIdx;
                            const StepIcon = step.icon;

                            return (
                                <div key={step.key} className="flex flex-col items-center gap-3 relative z-10 w-fit px-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500",
                                        isCompleted ? "bg-amber-500 text-white" :
                                            isActive ? "bg-slate-900 text-white scale-110" :
                                                "bg-slate-100 text-slate-400"
                                    )}>
                                        {isCompleted ? <CheckCircle2 size={18} /> : <StepIcon size={18} />}
                                    </div>
                                    <span className={cn(
                                        "text-[11px] font-black uppercase tracking-tighter",
                                        isActive ? "text-slate-900" : "text-slate-400"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2.3 Main Body Split (No Cards) */}
                <div className="flex flex-col lg:flex-row">

                    {/* LEFT SECTION (Main Items) */}
                    <div className="flex-1 overflow-hidden">
                        <div className="px-10 py-8">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Package size={18} className="text-amber-500" />
                                Sản phẩm đặt mua
                            </h3>

                            <div className="overflow-x-auto pb-4">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-50">
                                            <th className="pb-4 text-left text-[10px] font-black text-slate-300 uppercase tracking-widest">Chi tiết sản phẩm</th>
                                            <th className="pb-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Đơn giá</th>
                                            <th className="pb-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">S.Lượng</th>
                                            <th className="pb-4 text-right text-[10px] font-black text-slate-300 uppercase tracking-widest">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {order.details?.map((item) => (
                                            <tr key={item.id} className="group hover:bg-slate-50/20 transition-all">
                                                <td className="py-6 pr-4">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-20 w-16 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                                                            <img src={item.product?.image_url} alt={item.product?.name} className="h-full w-full object-cover p-1" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors uppercase">{item.product?.name}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1 font-bold">MÃ SP: #{item.product?.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 text-center text-sm font-bold text-slate-600">{formatCurrency(item.price)}</td>
                                                <td className="py-6 text-center">
                                                    <span className="text-sm font-black text-slate-900">×{item.quantity}</span>
                                                </td>
                                                <td className="py-6 text-right text-sm font-black text-slate-900 font-price">{formatCurrency(item.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Internal Calculation Summary */}
                            <div className="mt-8 flex flex-col items-end pt-8 border-t border-slate-100 space-y-4 pr-4">
                                <div className="w-full md:w-[300px] flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest">Tổng tiền hàng:</span>
                                    <span className="text-slate-900">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="w-full md:w-[300px] flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-400 uppercase tracking-widest">Phí vận chuyển:</span>
                                    <span className="text-emerald-600 uppercase">
                                        {parseInt(order.shipping_fee) === 0 ? "MIỄN PHÍ" : formatCurrency(order.shipping_fee)}
                                    </span>
                                </div>
                                {parseFloat(order.discount_amount) > 0 && (
                                    <div className="w-full md:w-[300px] flex justify-between items-center text-xs font-bold">
                                        <span className="text-rose-400 uppercase tracking-widest">Giảm giá:</span>
                                        <span className="text-rose-600">-{formatCurrency(order.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="w-full md:w-[300px] flex justify-between items-end pt-4 border-t border-slate-900 transition-all">
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Thanh toán:</span>
                                    <span className="text-3xl font-black text-slate-900 font-price leading-none tracking-tighter">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline (Bottom Part of Main Area) */}
                        <div className="px-10 py-12 bg-slate-50/20 border-t border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-8 text-sm">
                                <Clock size={16} className="text-slate-400" />
                                Lịch sử điều phối đơn
                            </h3>
                            <div className="space-y-6 relative ml-4">
                                <div className="absolute left-[3px] top-4 bottom-4 w-[1px] bg-slate-200" />
                                {order.history?.map((h, idx) => (
                                    <div key={idx} className="flex gap-6 items-start relative group">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full mt-2 relative z-10 transition-all group-hover:scale-150 duration-300",
                                            h.status === 'delivered' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' :
                                                h.status === 'cancelled' ? 'bg-rose-500' : 'bg-slate-900'
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">{getStatusLabel(h.status)}</span>
                                                <span className="text-[10px] font-bold text-slate-300">{new Date(h.created_at).toLocaleString('vi-VN')}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 italic font-medium leading-relaxed">{h.note || "Hệ thống ghi nhận."}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION (Sidebar Information) */}
                    <div className="w-full lg:w-[380px] bg-slate-50/30 border-l border-slate-100 p-10 space-y-12">

                        {/* Customer Overview */}
                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-3 flex items-center gap-2">
                                <User size={14} className="text-amber-500" />
                                Khách hàng
                            </h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                                        <User size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Họ & Tên</span>
                                        <span className="text-sm font-bold text-slate-900 uppercase mt-0.5">{order.full_name}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liên hệ</span>
                                        <span className="text-sm font-bold text-slate-900 mt-0.5">{order.phone_number}</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giao nhận tại</span>
                                        <span className="text-xs font-bold text-slate-600 leading-relaxed mt-1">
                                            {order.address_line}{order.ward ? `, ${order.ward}` : ''}{order.district ? `, ${order.district}` : ''}{order.city ? `, ${order.city}` : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* New Smart Operational Control Area */}
                        <div className="space-y-8 pt-4">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-3 flex items-center gap-2">
                                <Info size={14} className="text-slate-400" />
                                Điều phối thông minh
                            </h3>

                            <div className="space-y-6">
                                {/* Workflow Status Indicator (Next Step focus) */}
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-slate-900/20 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Hành động tiếp theo</span>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-bold">
                                                {order.status === 'pending' && "Xác nhận tính hợp lệ của đơn hàng"}
                                                {order.status === 'confirmed' && "Đưa đơn hàng vào quy trình xử lý"}
                                                {order.status === 'processing' && "Khởi tạo thông tin giao nhận"}
                                                {order.status === 'shipping' && "Xác nhận khách đã nhận được hàng"}
                                            </h4>
                                            <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                                                {order.status === 'pending' && "Kiểm tra thông tin thanh toán và liên hệ khách hàng nếu cần thiết."}
                                                {order.status === 'confirmed' && "Chuyển trạng thái để bắt đầu việc lấy hàng và đóng gói tại kho."}
                                                {order.status === 'processing' && "Đơn hàng đã sẵn sàng. Hãy bàn giao cho đơn vị vận chuyển."}
                                                {order.status === 'shipping' && "Chỉ nhấn hoàn tất khi tiền đã thu (COD) hoặc hàng đã giao thành công."}
                                            </p>
                                        </div>

                                        <Button 
                                            onClick={() => {
                                                const next = {
                                                    pending: 'confirmed',
                                                    confirmed: 'processing',
                                                    processing: 'shipping',
                                                    shipping: 'delivered'
                                                };
                                                handleUpdateStatus(next[order.status]);
                                            }} 
                                            disabled={updating} 
                                            className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            {updating ? "Đang xử lý..." : (
                                                order.status === 'pending' ? "Chấp nhận đơn hàng" :
                                                order.status === 'confirmed' ? "Bắt đầu xử lý kho" :
                                                order.status === 'processing' ? "Giao cho vận chuyển" :
                                                "Hoàn tất giao dịch"
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {order.status === 'delivered' && (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 text-center space-y-3">
                                        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-tighter">Giao dịch thành công</h4>
                                        <p className="text-[10px] text-emerald-600/70">Đơn hàng này đã được khép lại và ghi nhận doanh thu.</p>
                                    </div>
                                )}

                                {/* Offline Payment Confirmation Card (COD & Banking) */}
                                {['cod', 'banking'].includes(order.payment_method) && order.payment_status !== 'paid' && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-5 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                <CreditCard size={16} className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-amber-900 uppercase tracking-widest">
                                                    {order.payment_method === 'cod' ? 'Chờ thu tiền COD' : 'Chờ xác nhận chuyển khoản'}
                                                </p>
                                                <p className="text-[10px] text-amber-600/70 mt-0.5">
                                                    {order.payment_method === 'cod' 
                                                        ? 'Xác nhận khi nhân viên giao hàng đã thu tiền mặt từ khách.'
                                                        : 'Xác nhận khi bạn nhận được tiền chuyển khoản từ khách.'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleMarkAsPaid}
                                            disabled={updating}
                                            className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm shadow-amber-500/30"
                                        >
                                            {updating ? "Đang xử lý..." : (order.payment_method === 'cod' ? "✓ Đã thu tiền COD" : "✓ Đã nhận chuyển khoản")}
                                        </Button>
                                    </div>
                                )}

                                {['cod', 'banking'].includes(order.payment_method) && order.payment_status === 'paid' && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                                        <CheckCircle2 size={14} />
                                        <span>
                                            {order.payment_method === 'cod' ? 'Đã thu tiền COD thành công' : 'Đã xác nhận chuyển khoản thành công'}
                                        </span>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lưu ý nội bộ</span>
                                            <span className="text-[9px] font-bold text-slate-300 italic">Chỉ quản trị viên thấy</span>
                                        </div>
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-600 focus:border-slate-900/30 focus:bg-slate-50/30 outline-none transition-all placeholder:text-slate-300 min-h-[100px] shadow-sm leading-relaxed"
                                            placeholder="Ghi chú về tình trạng đóng gói, mã vận đơn hoặc lý do thay đổi..."
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                    </div>

                                    {['pending', 'confirmed', 'processing'].includes(order.status) && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleUpdateStatus('cancelled')}
                                            disabled={updating}
                                            className="w-full h-10 text-rose-500 hover:bg-rose-50 rounded-2xl font-bold text-[10px] uppercase tracking-widest group"
                                        >
                                            <XCircle size={14} className="mr-2 transition-transform group-hover:scale-110" /> Hủy giao dịch này
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Print Logic */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 1cm; size: A4; }
                    body { background: white !important; font-family: sans-serif; }
                    header, aside, .print-hidden, footer, .main-header { display: none !important; }
                    .max-w-[1400px] { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    .bg-white, .bg-slate-50 { background: transparent !important; box-shadow: none !important; border: 1px solid #eee !important; border-radius: 0 !important; }
                    .flex { display: block !important; }
                    .lg\\:w-[380px] { width: 100% !important; border-left: none !important; border-top: 1px solid #eee !important; margin-top: 2rem !important; }
                    .border-r, .border-l { border: none !important; border-bottom: 1px solid #eee !important; }
                    .rounded-[2rem], .rounded-2xl { border-radius: 0.5rem !important; }
                    table { width: 100% !important; border-collapse: collapse; }
                    th { border-bottom: 2px solid #333 !important; padding: 0.5rem !important; }
                    td { border-bottom: 1px solid #eee !important; padding: 1rem 0.5rem !important; }
                    .text-amber-600 { color: black !important; font-weight: 900 !important; }
                }
            `}} />
        </div>
    );
};

export default OrderDetailPage;
