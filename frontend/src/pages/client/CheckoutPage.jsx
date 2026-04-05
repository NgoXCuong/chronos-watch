import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
    ChevronLeft, ShieldCheck, Truck,
    CreditCard, MapPin, Phone,
    User, CheckCircle2, Wallet,
    Loader2, ArrowRight, Plus,
    MessageSquare
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import orderApi from '../../api/order.api';
import userAddressApi from '../../api/user_address.api';
import voucherApi from '../../api/voucher.api';
import { toast } from 'sonner';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { cart, cartSubtotal, clearCart } = useCart();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderNote, setOrderNote] = useState('');
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [shippingFee] = useState(0); // Miễn phí vận chuyển
    const [isProcessingRedirect, setIsProcessingRedirect] = useState(false);

    // Voucher states
    const [voucherCodeInput, setVoucherCodeInput] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

    // New address form state
    const [formData, setFormData] = useState({
        recipient_name: user?.full_name || '',
        recipient_phone: user?.phone || '',
        address_line: '',
        ward: '',
        district: '',
        city: '',
        is_default: false
    });

    const fetchAddresses = async () => {
        try {
            const res = await userAddressApi.getAll();
            const addrList = res.data || res;
            setAddresses(addrList);

            if (addrList.length > 0) {
                const def = addrList.find(a => a.is_default) || addrList[0];
                setSelectedAddressId(def.id);
                setIsAddingNewAddress(false);
            } else {
                setIsAddingNewAddress(true);
            }
        } catch (err) {
            console.error('Failed to fetch addresses', err);
            toast.error('Không thể tải danh sách địa chỉ');
        }
    };


    useEffect(() => {
        if (isAuthenticated) {
            fetchAddresses();
        }
    }, [isAuthenticated]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (isAddingNewAddress) {
            if (!formData.recipient_name || !formData.recipient_phone || !formData.address_line || !formData.city) {
                toast.error('Vui lòng điền đầy đủ thông tin giao hàng mới');
                return false;
            }
        } else if (!selectedAddressId) {
            toast.error('Vui lòng chọn hoặc thêm địa chỉ giao hàng');
            return false;
        }
        return true;
    };

    const handleApplyVoucher = async () => {
        if (!voucherCodeInput.trim()) {
            toast.error('Vui lòng nhập mã đặc quyền');
            return;
        }
        setIsApplyingVoucher(true);
        try {
            const res = await voucherApi.validate(voucherCodeInput.trim(), cartSubtotal);
            if (res.valid) {
                setAppliedVoucher(res.voucher);
                setDiscountAmount(res.discount_amount || 0);
                toast.success('Áp dụng mã đặc quyền thành công!');
            }
        } catch (err) {
            console.error('Lỗi khi áp dụng voucher:', err);
            const msg = err.response?.data?.message || err.message || 'Mã không hợp lệ hoặc đã hết hạn';
            toast.error(msg);
            setAppliedVoucher(null);
            setDiscountAmount(0);
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const orderData = {
                order_note: orderNote,
                payment_method: paymentMethod,
                shipping_fee: shippingFee,
                address_id: isAddingNewAddress ? null : selectedAddressId,
                voucher_code: appliedVoucher ? appliedVoucher.code : undefined,
                // If adding new, send fields
                ...(isAddingNewAddress ? {
                    full_name: formData.recipient_name,
                    phone_number: formData.recipient_phone,
                    address_line: formData.address_line,
                    ward: formData.ward,
                    district: formData.district,
                    city: formData.city
                } : {})
            };

            const res = await orderApi.checkout(orderData);

            if (res.data || res) {
                toast.success('Đơn hàng đã được đặt thành công');
                setIsProcessingRedirect(true); // Đánh dấu đang chuyển hướng, không quay lại giỏ hàng
                clearCart();
                const result = res.data || res;

                if (paymentMethod === 'vnpay' && result.paymentUrl) {
                    window.location.href = result.paymentUrl;
                } else {
                    navigate(`/checkout/success?orderId=${result.order.id}`);
                }
            }
        } catch (err) {
            console.error('Checkout Error:', err);
            const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng';
            toast.error(errorMsg);
        } finally {
            if (!isProcessingRedirect) setLoading(false);
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    const cartTotal = cartSubtotal + shippingFee - discountAmount;

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (cart.length === 0 && !isProcessingRedirect) return <Navigate to="/cart" />;

    return (
        <div className={`min-h-screen pb-24 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            {/* Header / Breadcrumbs */}
            <div className={`border-b ${isDark ? 'border-white/5 bg-zinc-900/20' : 'border-zinc-100 bg-zinc-50/50'}`}>
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/cart')}
                        className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
                    >
                        <ChevronLeft className="w-4 h-4" /> Quay lại giỏ hàng
                    </button>
                    <div className="flex items-center gap-8 md:gap-16">
                        {[
                            { label: 'Giỏ Hàng', active: false, done: true },
                            { label: 'Giao Nhận', active: true, done: false },
                            { label: 'Thanh Toán', active: false, done: false }
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className={`text-[10px] font-black ${s.active ? 'text-amber-500' : (s.done ? 'text-emerald-500' : 'text-zinc-600')}`}>
                                    {s.done ? <CheckCircle2 className="w-3 h-3" /> : `0${i + 1}`}
                                </span>
                                <span className={`text-[9px] uppercase font-black tracking-[0.2em] ${s.active ? (isDark ? 'text-white' : 'text-zinc-900') : 'text-zinc-600'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="w-32 hidden md:block"></div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-6 pt-12 md:pt-16">
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

                    {/* --- Left Column: Info --- */}
                    <div className="flex-1 space-y-12">

                        {/* 1. Shipping Address Selection */}
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className={`text-xl font-bold uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Thông tin giao hàng</h2>
                            </div>

                            {addresses.length > 0 && !isAddingNewAddress ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`p-5 border cursor-pointer transition-all duration-300 relative group rounded-xl
                                                ${selectedAddressId === addr.id
                                                    ? 'border-amber-500 bg-amber-500/5'
                                                    : (isDark ? 'border-white/5 bg-zinc-900/30 hover:border-white/10' : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300')}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <p className={`text-[11px] font-black uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>{addr.recipient_name}</p>
                                                {addr.is_default && <span className="text-[8px] bg-amber-500 text-white px-1.5 py-0.5 rounded-none font-bold uppercase">Mặc định</span>}
                                            </div>
                                            <p className={`text-[12px] mb-1 line-clamp-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{addr.address_line}</p>
                                            <p className={`text-[12px] mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{addr.ward ? `${addr.ward}, ` : ''}{addr.district ? `${addr.district}, ` : ''}{addr.city}</p>
                                            <p className={`text-[12px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{addr.recipient_phone}</p>

                                            {selectedAddressId === addr.id && (
                                                <div className="absolute top-2 right-2 text-amber-500">
                                                    <CheckCircle2 className="w-4 h-4 fill-current" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setIsAddingNewAddress(true)}
                                        className={`p-5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all
                                            ${isDark ? 'border-white/5 text-zinc-600 hover:text-zinc-400 hover:border-white/10' : 'border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300'}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-black tracking-widest">Dùng địa chỉ khác</span>
                                    </button>
                                </div>
                            ) : (
                                <div className={`p-8 border rounded-[2rem] space-y-8 ${isDark ? 'border-white/5 bg-zinc-900/20' : 'border-zinc-100 bg-zinc-50/50'}`}>
                                    <div className="flex items-center justify-between">
                                        <h3 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>Nhập địa chỉ mới</h3>
                                        {addresses.length > 0 && (
                                            <button
                                                onClick={() => setIsAddingNewAddress(false)}
                                                className="text-[10px] uppercase font-bold text-amber-500 hover:underline"
                                            >
                                                Chọn từ địa chỉ đã lưu
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Người nhận</label>
                                            <input
                                                name="recipient_name" value={formData.recipient_name} onChange={handleInputChange}
                                                placeholder="Họ và tên"
                                                className={`w-full h-12 px-4 text-sm font-medium border rounded-xl outline-none transition-all ${isDark ? 'bg-zinc-950 border-white/5 text-white focus:border-amber-500' : 'bg-white border-zinc-200 text-zinc-900 focus:border-amber-600'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Số điện thoại</label>
                                            <input
                                                name="recipient_phone" value={formData.recipient_phone} onChange={handleInputChange}
                                                placeholder="SĐT liên hệ"
                                                className={`w-full h-12 px-4 text-sm font-medium border rounded-xl outline-none transition-all ${isDark ? 'bg-zinc-950 border-white/5 text-white focus:border-amber-500' : 'bg-white border-zinc-200 text-zinc-900 focus:border-amber-600'}`}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Địa chỉ chi tiết</label>
                                            <input
                                                name="address_line" value={formData.address_line} onChange={handleInputChange}
                                                placeholder="Số nhà, tên đường..."
                                                className={`w-full h-12 px-4 text-sm font-medium border rounded-xl outline-none transition-all ${isDark ? 'bg-zinc-950 border-white/5 text-white focus:border-amber-500' : 'bg-white border-zinc-200 text-zinc-900 focus:border-amber-600'}`}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-2">
                                            <input
                                                name="ward" value={formData.ward} onChange={handleInputChange} placeholder="Phường/Xã"
                                                className={`h-12 px-4 text-sm font-medium border rounded-xl outline-none ${isDark ? 'bg-zinc-950 border-white/5 text-white focus:border-amber-500' : 'bg-white border-zinc-200 focus:border-amber-600'}`}
                                            />
                                            <input
                                                name="district" value={formData.district} onChange={handleInputChange} placeholder="Quận/Huyện"
                                                className={`h-12 px-4 text-sm font-medium border rounded-xl outline-none ${isDark ? 'bg-zinc-950 border-white/5 text-white focus:border-amber-500' : 'bg-white border-zinc-200 focus:border-amber-600'}`}
                                            />
                                            <input
                                                name="city" value={formData.city} onChange={handleInputChange} placeholder="Tỉnh/Thành phố"
                                                className={`h-12 px-4 text-sm font-medium border rounded-xl outline-none ${isDark ? 'bg-zinc-950 border-white/5 text-white focus:border-amber-500' : 'bg-white border-zinc-200 focus:border-amber-600'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Order Note */}
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <h2 className={`text-xl font-bold uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Lời nhắn đơn hàng</h2>
                            </div>
                            <textarea
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                placeholder="Ghi chú về đơn hàng hoặc nội dung thanh toán..."
                                className={`w-full min-h-[120px] p-6 text-sm font-medium border rounded-[2rem] outline-none transition-all resize-none ${isDark ? 'bg-zinc-900/20 border-white/5 text-white focus:border-amber-500' : 'bg-zinc-50/50 border-zinc-100 text-zinc-900 focus:border-amber-600'}`}
                            />
                        </section>

                        {/* 2. Payment Methods */}
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h2 className={`text-xl font-bold uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Phương thức thanh toán</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: <Truck className="w-5 h-5" />, desc: 'Thanh toán tiền mặt khi đơn hàng được giao tới tay bạn.' },
                                    { id: 'vnpay', label: 'Cổng thanh toán VNPay', icon: <Wallet className="w-5 h-5" />, desc: 'Thanh toán qua Ví điện tử, Thẻ ATM nội địa hoặc QR Code.' },
                                    { id: 'banking', label: 'Chuyển khoản ngân hàng', icon: <CreditCard className="w-5 h-5" />, desc: 'Chuyển khoản trực tiếp tới tài khoản của Chronos.' }
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-start gap-5 p-6 border rounded-[1.5rem] cursor-pointer transition-all duration-300
                                            ${paymentMethod === method.id
                                                ? 'border-amber-500 bg-amber-500/5'
                                                : (isDark ? 'border-white/5 bg-zinc-900/30 hover:border-white/10' : 'border-zinc-100 bg-zinc-50/50 hover:border-zinc-200')}`}
                                    >
                                        <input
                                            type="radio" name="payment" value={method.id}
                                            checked={paymentMethod === method.id}
                                            onChange={() => setPaymentMethod(method.id)}
                                            className="mt-1 w-4 h-4 accent-amber-500"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`${paymentMethod === method.id ? 'text-amber-500' : 'text-zinc-500'}`}>{method.icon}</span>
                                                <span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{method.label}</span>
                                            </div>
                                            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>{method.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* --- Right Column: Order Summary --- */}
                    <div className="w-full lg:w-[400px] xl:w-[450px]">
                        <div className={`sticky top-32 p-8 md:p-10 border rounded-[2.5rem] transition-all duration-700
                            ${isDark
                                ? 'border-white/5 bg-zinc-900/40 backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]'
                                : 'border-zinc-100 bg-zinc-50/50 backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]'}`}>

                            <h2 className={`text-[12px] uppercase font-black tracking-[0.3em] mb-8 pb-4 border-b border-zinc-500/10 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                Đơn hàng của bạn
                            </h2>

                            {/* Summary Items */}
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-16 h-16 bg-white overflow-hidden border border-zinc-500/10 flex-shrink-0 rounded-lg text-black">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className={`text-[11px] font-bold line-clamp-1 mb-1 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.name}</h4>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-zinc-500 font-medium">Số lượng: {item.quantity}</span>
                                                <span className={`text-[11px] font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 mb-10 pt-4 border-t border-zinc-500/10">
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className={isDark ? 'text-zinc-500' : 'text-zinc-500'}>Tạm tính</span>
                                    <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{formatCurrency(cartSubtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className={isDark ? 'text-zinc-500' : 'text-zinc-500'}>Phí vận chuyển</span>
                                    <span className={`font-bold ${shippingFee === 0 ? 'text-emerald-500' : (isDark ? 'text-zinc-200' : 'text-zinc-800')}`}>
                                        {shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}
                                    </span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className={isDark ? 'text-zinc-500' : 'text-zinc-500'}>Giảm giá (Ưu đãi)</span>
                                        <span className={`font-bold text-red-500`}>
                                            - {formatCurrency(discountAmount)}
                                        </span>
                                    </div>
                                )}
                                <div className={`pt-6 mt-6 border-t font-black flex justify-between items-end ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
                                    <div className="flex flex-col">
                                        <span className={`text-[8px] uppercase font-black tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Tổng thanh toán</span>
                                        <span className={`text-2xl tracking-tight text-amber-500`}>
                                            {formatCurrency(cartTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Promotional Input */}
                            <div className="mb-8 group">
                                <label className={`block text-[9px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Nhập mã đặc quyền</label>
                                <div className="flex h-12">
                                    <input
                                        type="text"
                                        placeholder="CHRONOS2025"
                                        value={voucherCodeInput}
                                        onChange={(e) => setVoucherCodeInput(e.target.value)}
                                        disabled={isApplyingVoucher || appliedVoucher}
                                        className={`flex-1 px-4 text-[11px] font-bold border-y border-l outline-none transition-all rounded-l-xl
                                            ${isDark
                                                ? 'bg-black/40 border-white/5 text-white disabled:opacity-50 focus:border-amber-500'
                                                : 'bg-white border-zinc-200 text-zinc-900 disabled:bg-zinc-100 disabled:opacity-70 focus:border-amber-600'}`}
                                    />
                                    {appliedVoucher ? (
                                        <button
                                            onClick={() => { setAppliedVoucher(null); setDiscountAmount(0); setVoucherCodeInput(''); }}
                                            className="px-6 bg-red-600 hover:bg-red-500 text-white text-[9px] font-black uppercase tracking-widest transition-all rounded-r-xl"
                                        >
                                            Hủy
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleApplyVoucher}
                                            disabled={isApplyingVoucher}
                                            className="px-6 bg-amber-600 hover:bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest transition-all rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isApplyingVoucher ? 'Đang Xử Lý' : 'Áp Dụng'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                variant="primary"
                                className="w-full h-16 rounded-xl group relative overflow-hidden"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <div className="flex items-center justify-center gap-3 relative z-10">
                                        <span className="text-[11px] uppercase font-black tracking-widest">Hoàn Tất Đặt Hàng</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </Button>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>Giao dịch bảo mật 256-bit SSL</span>
                                </div>
                                <div className="p-4 bg-amber-500/5 border border-amber-500/10 text-[10px] leading-relaxed text-zinc-500 italic">
                                    "Bằng việc đặt hàng, quý khách đồng ý cung cấp thông tin chính xác để Chronos có thể phục vụ tốt nhất."
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
