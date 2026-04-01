import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Printer, 
    Package, 
    Truck, 
    CheckCircle, 
    XCircle, 
    Clock, 
    CreditCard, 
    User, 
    MapPin,
    Phone,
    Mail,
    ChevronRight
} from 'lucide-react';
import adminApi from '../../../api/admin.api';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';

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
            toast.success("Cập nhật trạng thái thành công");
            setNote('');
            fetchOrderDetail();
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật trạng thái");
        } finally {
            setUpdating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) return <div className="text-center py-20 font-bold text-slate-400">Không tìm thấy đơn hàng</div>;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'cancelled': 
            case 'returned': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Đã xác nhận';
            case 'processing': return 'Đang xử lý';
            case 'shipped': return 'Đang giao hàng';
            case 'delivered': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Actions - Hide on Print */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/admin/orders')} className="rounded-xl h-10 w-10 p-0 text-slate-500 hover:text-slate-900 border border-slate-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-slate-900">Chi tiết đơn hàng #{order.id}</h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">Đặt lúc: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handlePrint} className="rounded-xl gap-2 border-slate-200">
                        <Printer className="h-4 w-4" /> In hóa đơn
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Items & Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50">
                            <h3 className="text-lg font-bold text-slate-900">Sản phẩm trong đơn</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đơn giá</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số lượng</th>
                                        <th className="px-8 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.details?.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden shadow-sm">
                                                        <img 
                                                            src={item.product?.image_url} 
                                                            alt={item.product?.name} 
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-800 line-clamp-1">{item.product?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center text-sm font-medium text-slate-600">{formatCurrency(item.price)}</td>
                                            <td className="px-6 py-5 text-center text-sm font-bold text-slate-900">{item.quantity}</td>
                                            <td className="px-8 py-5 text-right text-sm font-bold text-amber-600 font-price">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Summary */}
                        <div className="p-8 bg-slate-50/30 border-t border-slate-50 ml-auto w-full md:w-1/2 space-y-3">
                            <div className="flex justify-between text-sm text-slate-500 font-medium">
                                <span>Tạm tính:</span>
                                <span className="text-slate-900">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500 font-medium">
                                <span>Phí vận chuyển:</span>
                                <span className="text-slate-900">{formatCurrency(order.shipping_fee)}</span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between text-sm text-rose-500 font-medium">
                                    <span>Giảm giá:</span>
                                    <span>-{formatCurrency(order.discount_amount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                                <span>Tổng cộng:</span>
                                <span className="text-amber-600">{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline / History */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-8">Lịch sử đơn hàng</h3>
                        <div className="space-y-6 relative">
                            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 print:hidden" />
                            {order.history?.map((h, idx) => (
                                <div key={idx} className="flex gap-6 relative">
                                    <div className={`h-8 w-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0 z-10 ${
                                        h.status === 'delivered' ? 'bg-emerald-500' : 
                                        h.status === 'cancelled' ? 'bg-rose-500' : 'bg-amber-500'
                                    }`}>
                                        <Clock className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">{getStatusLabel(h.status)}</p>
                                        <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">{new Date(h.created_at).toLocaleString('vi-VN')}</p>
                                        <p className="text-sm text-slate-600 mt-2 italic bg-slate-50 p-3 rounded-xl border border-slate-100">{h.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Status Controls */}
                <div className="space-y-6 print:hidden">
                    {/* Status Management */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                        <h3 className="text-base font-bold text-slate-900 mb-6 font-heading tracking-wider">Cập nhật trạng thái</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Ghi chú cập nhật</label>
                                <textarea 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 outline-none transition-all placeholder:text-slate-300 min-h-[100px]"
                                    placeholder="Nhập lý do thay đổi trạng thái..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {order.status === 'pending' && (
                                    <Button 
                                        onClick={() => handleUpdateStatus('confirmed')} 
                                        disabled={updating}
                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 text-xs font-bold uppercase tracking-widest"
                                    >Xác nhận</Button>
                                )}
                                {['confirmed', 'pending'].includes(order.status) && (
                                    <Button 
                                        onClick={() => handleUpdateStatus('processing')} 
                                        disabled={updating}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 text-xs font-bold uppercase tracking-widest"
                                    >Xử lý</Button>
                                )}
                                {['processing', 'confirmed'].includes(order.status) && (
                                    <Button 
                                        onClick={() => handleUpdateStatus('shipped')} 
                                        disabled={updating}
                                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-10 text-xs font-bold uppercase tracking-widest shadow-lg shadow-purple-600/20"
                                    >Giao hàng</Button>
                                )}
                                {order.status === 'shipped' && (
                                    <Button 
                                        onClick={() => handleUpdateStatus('delivered')} 
                                        disabled={updating}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                                    >Hoàn thành</Button>
                                )}
                                {['pending', 'confirmed'].includes(order.status) && (
                                    <Button 
                                        variant="outline"
                                        onClick={() => handleUpdateStatus('cancelled')} 
                                        disabled={updating}
                                        className="border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl h-10 text-xs font-bold uppercase tracking-widest"
                                    >Hủy đơn</Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-4">Thông tin khách hàng</h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Họ tên</p>
                                    <p className="text-sm font-bold text-slate-900">{order.full_name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Số điện thoại</p>
                                    <p className="text-sm font-bold text-slate-900">{order.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Địa chỉ giao hàng</p>
                                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">{order.shipping_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info Card */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <CreditCard size={100} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-4">Thanh toán</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phương thức</span>
                                <span className="text-xs font-bold text-slate-900 uppercase">{order.payment_method}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                    {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { margin: 1.5cm; }
                    body { background: white !important; font-family: "Inter", sans-serif; }
                    header, aside, .print-hidden, footer, .main-header { display: none !important; }
                    .max-w-7xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    .bg-white { background: transparent !important; box-shadow: none !important; border: none !important; }
                    .lg\\:grid-cols-3 { display: block !important; }
                    .lg\\:col-span-2 { width: 100% !important; }
                    table { border: 1px solid #e2e8f0; }
                    th { background-color: #f8fafc !important; color: black !important; -webkit-print-color-adjust: exact; }
                    .text-amber-600 { color: black !important; }
                }
            `}} />
        </div>
    );
};

export default OrderDetailPage;
