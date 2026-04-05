import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
    CheckCircle2, ShoppingBag, ArrowRight,
    Calendar, CreditCard, MapPin,
    Truck, Package, ExternalLink
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useTheme } from '../../context/ThemeContext';
import orderApi from '../../api/order.api';
import paymentApi from '../../api/payment.api';

const CheckoutSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bankConfig, setBankConfig] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }
            try {
                const [orderRes, bankRes] = await Promise.all([
                    orderApi.getOrderDetail(orderId),
                    paymentApi.getBankConfig()
                ]);
                setOrder(orderRes.data || orderRes);
                setBankConfig(bankRes);
            } catch (err) {
                console.error('Error fetching order:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pb-24 pt-32 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            <div className="max-w-[800px] mx-auto px-6">

                {/* Success Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 mb-8 relative">
                        <CheckCircle2 className="w-12 h-12 relative z-10" />
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-25"></div>
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {order?.payment_status === 'paid' ? 'Thanh toán thành công' : 'Đặt hàng thành công'}
                    </h1>
                    <p className={`text-lg font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {order?.payment_status === 'paid'
                            ? 'Cảm ơn bạn đã tin tưởng Chronos. Đơn hàng đã được thanh toán và đang được xử lý.'
                            : 'Cảm ơn bạn đã tin tưởng Chronos. Đơn hàng của bạn đã được ghi nhận.'}
                    </p>
                </div>

                {order ? (
                    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">

                        {/* Order Summary Card */}
                        <div className={`p-8 md:p-10 border rounded-[2.5rem] ${isDark ? 'border-white/5 bg-zinc-900/40 backdrop-blur-3xl' : 'border-zinc-100 bg-zinc-50/50 backdrop-blur-3xl'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-500/10">
                                <div>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block mb-1">Mã đơn hàng</span>
                                    <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>#{order.id}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block mb-1">Ngày đặt hàng</span>
                                    <div className={`flex items-center gap-2 font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                        <Calendar className="w-4 h-4 text-amber-500" />
                                        <span>
                                            {(order.created_at || order.createdAt)
                                                ? new Date(order.created_at || order.createdAt).toLocaleDateString('vi-VN')
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className={`text-[11px] uppercase font-black tracking-widest mb-2 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Địa chỉ giao hàng</h4>
                                            <p className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{order.full_name}</p>
                                            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{order.address_line}</p>
                                            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{order.ward}, {order.district}, {order.city}</p>
                                            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{order.phone_number}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className={`text-[11px] uppercase font-black tracking-widest mb-2 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Thanh toán</h4>
                                            <p className={`text-sm font-bold mb-1 uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>{order.payment_method}</p>
                                            <p className={`text-[10px] font-black uppercase ${order.payment_status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 md:pt-0">
                                    <h4 className={`text-[11px] uppercase font-black tracking-widest mb-4 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Chi tiết hóa đơn</h4>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500">Tạm tính</span>
                                        <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{formatCurrency(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500">Phí vận chuyển</span>
                                        <span className={`font-bold ${order.shipping_fee === 0 ? 'text-emerald-500' : (isDark ? 'text-zinc-200' : 'text-zinc-800')}`}>
                                            {order.shipping_fee === 0 ? 'MIỄN PHÍ' : formatCurrency(order.shipping_fee)}
                                        </span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-500">Giảm giá</span>
                                            <span className="font-bold text-amber-500">-{formatCurrency(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className={`pt-6 mt-6 border-t font-black flex justify-between items-end ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
                                        <span className={`text-[8px] uppercase font-black tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Tổng cộng</span>
                                        <span className={`text-3xl tracking-tight text-amber-500`}>
                                            {formatCurrency(order.total_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Transfer Instructions with VietQR */}
                        {order.payment_method === 'banking' && order.payment_status !== 'paid' && bankConfig && (
                            <div className={`p-8 md:p-10 border rounded-[2.5rem] mt-4 shadow-lg ${isDark ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-500/20 bg-amber-50/80 backdrop-blur-sm'}`}>
                                <h3 className={`text-sm font-black uppercase tracking-widest text-amber-600 mb-6 flex items-center gap-3`}>
                                    <CreditCard className="w-5 h-5" /> Hướng dẫn chuyển khoản
                                </h3>
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                    {/* QR Code */}
                                    <div className={`shrink-0 p-4 rounded-3xl border-2 ${isDark ? 'bg-white border-amber-500/50' : 'bg-white border-amber-300'} shadow-xl`}>
                                        <div className="w-48 h-48 sm:w-56 sm:h-56 relative">
                                            <img
                                                src={`${bankConfig.qrBaseUrl}/${bankConfig.bankId}-${bankConfig.accountNo}-${bankConfig.template}.png?amount=${order.total_amount}&addInfo=CHRONOS%20${order.id}&accountName=${encodeURIComponent(bankConfig.accountName)}`}
                                                alt="VietQR Mã Thanh Toán"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <p className="text-center text-[10px] font-bold text-zinc-500 mt-3 uppercase tracking-widest">
                                            Quét mã qua app ngân hàng
                                        </p>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="flex-1 space-y-4 w-full">
                                        <p className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                            Hoặc chuyển tiền thủ công với thông tin dưới đây:
                                        </p>
                                        <div className={`p-6 rounded-2xl space-y-4 font-mono text-sm leading-relaxed ${isDark ? 'bg-black/50 text-emerald-400' : 'bg-white text-zinc-900 border border-amber-200 shadow-sm'}`}>
                                            <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-3 border-amber-500/10 gap-1"><span className="text-zinc-500 text-xs uppercase tracking-widest font-sans">Ngân hàng</span> <strong className="text-base select-all uppercase">{bankConfig.bankId}</strong></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-3 border-amber-500/10 gap-1"><span className="text-zinc-500 text-xs uppercase tracking-widest font-sans">Số tài khoản</span> <strong className="text-base select-all tracking-wider text-amber-600 dark:text-amber-400">{bankConfig.accountNo}</strong></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-3 border-amber-500/10 gap-1"><span className="text-zinc-500 text-xs uppercase tracking-widest font-sans">Chủ tài khoản</span> <strong className="text-base select-all uppercase">{bankConfig.accountName}</strong></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between pt-2 gap-1"><span className="text-zinc-500 text-xs uppercase tracking-widest font-sans">Nội dung chuyển khoản</span> <strong className="text-base select-all text-emerald-600 dark:text-emerald-400 font-bold">CHRONOS {order.id}</strong></div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between pt-2 gap-1"><span className="text-zinc-500 text-xs uppercase tracking-widest font-sans">Số tiền</span> <strong className="text-base select-all font-bold">{formatCurrency(order.total_amount)}</strong></div>
                                        </div>
                                        <div className={`p-4 mt-6 rounded-xl border flex gap-3 ${isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-200/80' : 'bg-amber-100/50 border-amber-200 text-amber-800'}`}>
                                            <Package className="w-5 h-5 flex-shrink-0" />
                                            <p className="text-xs italic leading-relaxed">
                                                * Đơn hàng tự động xác nhận sau 1-5 phút khi bạn quét mã VietQR. Nếu chuyển khoản thủ công, vui lòng ghi đúng nội dung.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <Button
                                onClick={() => navigate('/products')}
                                variant="outline"
                                className="h-14 px-10 rounded-xl group"
                            >
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                <span className="text-[11px] uppercase font-black tracking-widest">Tiếp tục mua sắm</span>
                            </Button>
                            <Button
                                onClick={() => navigate('/profile', { state: { activeTab: 'orders' } })}
                                variant="primary"
                                className="h-14 px-10 rounded-xl group"
                            >
                                <span className="text-[11px] uppercase font-black tracking-widest">Xem đơn hàng</span>
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 mb-8">Không tìm thấy thông tin đơn hàng hoặc đã có lỗi xảy ra.</p>
                        <Button onClick={() => navigate('/')} variant="primary" className="h-12 px-8 rounded-xl">
                            Về trang chủ
                        </Button>
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-20 flex flex-wrap justify-center gap-12 border-t border-zinc-500/10 pt-12">
                    <div className="flex items-center gap-4">
                        <Truck className="w-5 h-5 text-amber-500" />
                        <span className={`text-[10px] uppercase font-black tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Giao hàng nhanh 24h</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Package className="w-5 h-5 text-amber-500" />
                        <span className={`text-[10px] uppercase font-black tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Đóng gói cao cấp</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ExternalLink className="w-5 h-5 text-amber-500" />
                        <span className={`text-[10px] uppercase font-black tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Bảo hành 5 năm</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;
