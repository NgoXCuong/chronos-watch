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
                        className={`flex items-center gap-2 text-[10px] uppercase font-black  transition-colors ${isDark ? 'text-zinc-700 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
                    >
                        <ChevronLeft className="w-4 h-4" /> Quay lại giỏ hàng
                    </button>
                    <div className="flex items-center gap-4 md:gap-6">
                        {[
                            { label: 'Giỏ Hàng', active: false, done: true },
                            { label: 'Giao Nhận', active: true, done: false },
                            { label: 'Thanh Toán', active: false, done: false }
                        ].map((s, i, array) => (
                            <React.Fragment key={i}>
                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Vòng tròn số/icon */}
                                    <span className={`
                    text-[10px] font-black rounded-full w-7 h-7 flex items-center justify-center transition-all duration-300
                    ${s.done
                                            ? 'bg-emerald-500 text-white'
                                            : s.active
                                                ? 'bg-amber-500 text-white ring-4 ring-amber-500/20 scale-110'
                                                : 'bg-zinc-200 text-zinc-500'}
                `}>
                                        {s.done ? <CheckCircle2 className="w-4 h-4" /> : `0${i + 1}`}
                                    </span>

                                    {/* Chữ Label */}
                                    <span className={`
                    text-[11px] md:text-[13px] uppercase font-bold whitespace-nowrap
                    ${s.active
                                            ? (isDark ? 'text-amber-400' : 'text-zinc-900')
                                            : s.done
                                                ? 'text-emerald-600'
                                                : 'text-zinc-400'}
                `}>
                                        {s.label}
                                    </span>
                                </div>

                                {/* Đường kẻ nối (Chỉ hiển thị giữa các bước, không hiển thị sau bước cuối) */}
                                {i < array.length - 1 && (
                                    <div className={`h-[2px] w-8 md:w-16 rounded-full transition-colors duration-500 ${s.done ? 'bg-emerald-500' : 'bg-zinc-200'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="w-32 hidden md:block"></div>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-6 pt-6">
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

                    {/* --- Left Column: Info --- */}
                    <div className="flex-1 space-y-6">

                        {/* 1. Shipping Address Selection */}
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className={`text-xl font-bold uppercase  ${isDark ? 'text-white' : 'text-zinc-900'}`}>Thông tin giao hàng</h2>
                            </div>

                            {addresses.length > 0 && !isAddingNewAddress ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                                {addr.is_default && <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-none font-bold uppercase">Mặc định</span>}
                                            </div>
                                            <p className={`text-[12px] mb-1 line-clamp-1 ${isDark ? 'text-zinc-600' : 'text-zinc-600'}`}>{addr.address_line}</p>
                                            <p className={`text-[12px] mb-1 ${isDark ? 'text-zinc-700' : 'text-zinc-700'}`}>{addr.ward ? `${addr.ward}, ` : ''}{addr.district ? `${addr.district}, ` : ''}{addr.city}</p>
                                            <p className={`text-[12px] ${isDark ? 'text-zinc-700' : 'text-zinc-600'}`}>{addr.recipient_phone}</p>

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
                                            ${isDark ? 'border-white/5 text-zinc-600 hover:text-zinc-600 hover:border-white/10' : 'border-zinc-200 text-zinc-600 hover:text-zinc-600 hover:border-zinc-300'}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-black ">Dùng địa chỉ khác</span>
                                    </button>
                                </div>
                            ) : (
                                <div className={`p-8 border rounded-[2rem] space-y-8 ${isDark ? 'border-white/5 bg-zinc-900/20' : 'border-zinc-100 bg-zinc-50/50'}`}>
                                    <div className="flex items-center justify-between">
                                        <h3 className={`text-sm font-bold uppercase  ${isDark ? 'text-white' : 'text-zinc-900'}`}>Nhập địa chỉ mới</h3>
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
                                            <label className={`text-[10px] uppercase font-bold  ${isDark ? 'text-zinc-700' : 'text-zinc-600'}`}>Người nhận</label>
                                            <input
                                                name="recipient_name" value={formData.recipient_name} onChange={handleInputChange}
                                                placeholder="Họ và tên"
                                                className={`w-full h-12 px-4 text-sm font-medium border rounded-xl outline-none transition-all ${isDark ? 'bg-zinc-950 border-white/5 text-white focus:border-amber-500' : 'bg-white border-zinc-200 text-zinc-900 focus:border-amber-600'}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className={`text-[10px] uppercase font-bold  ${isDark ? 'text-zinc-700' : 'text-zinc-600'}`}>Số điện thoại</label>
                                            <input
                                                name="recipient_phone" value={formData.recipient_phone} onChange={handleInputChange}
                                                placeholder="SĐT liên hệ"
                                                className={`w-full h-12 px-4 text-sm font-medium border rounded-xl outline-none transition-all ${isDark ? 'bg-zinc-950 border-white/5 text-white focus:border-amber-500' : 'bg-white border-zinc-200 text-zinc-900 focus:border-amber-600'}`}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className={`text-[10px] uppercase font-bold  ${isDark ? 'text-zinc-700' : 'text-zinc-600'}`}>Địa chỉ chi tiết</label>
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
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <h2 className={`text-xl font-bold uppercase  ${isDark ? 'text-white' : 'text-zinc-900'}`}>Lời nhắn đơn hàng</h2>
                            </div>
                            <textarea
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                placeholder="Ghi chú về đơn hàng hoặc nội dung thanh toán..."
                                className={`w-full min-h-[80px] p-6 text-sm font-medium border outline-none transition-all resize-none ${isDark ? 'bg-zinc-900/20 border-white/5 text-white focus:border-amber-500' : 'bg-zinc-50/50 border-zinc-100 text-zinc-900 focus:border-amber-600'}`}
                            />
                        </section>

                        {/* 2. Payment Methods */}
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h2 className={`text-xl font-bold uppercase  ${isDark ? 'text-white' : 'text-zinc-900'}`}>Phương thức thanh toán</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: <Truck className="w-5 h-5" />, desc: 'Thanh toán tiền mặt khi đơn hàng được giao tới tay bạn.' },
                                    { id: 'vnpay', label: 'Cổng thanh toán VNPay', icon: <Wallet className="w-5 h-5" />, desc: 'Thanh toán qua Ví điện tử, Thẻ ATM nội địa hoặc QR Code.' },
                                    { id: 'banking', label: 'Chuyển khoản ngân hàng', icon: <CreditCard className="w-5 h-5" />, desc: 'Chuyển khoản trực tiếp tới tài khoản của Chronos.' }
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-start gap-5 p-4 py-2 border cursor-pointer transition-all duration-300
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
                                                <span className={`${paymentMethod === method.id ? 'text-amber-500' : 'text-zinc-700'}`}>{method.icon}</span>
                                                <span className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{method.label}</span>
                                            </div>
                                            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-700' : 'text-zinc-700'}`}>{method.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* --- Right Column: Order Summary --- */}
                    <div className="w-full lg:w-[400px] xl:w-[450px]">
                        <div className={`sticky top-32 p-8 md:p-4 border transition-all duration-700`}>

                            {/* Header với hiệu ứng gradient chữ */}
                            <h2 className={`text-xl uppercase font-black mb-4  border-b
            ${isDark ? 'text-white border-white/5' : 'text-zinc-900 border-zinc-100'}`}>
                                Tóm tắt đơn hàng
                            </h2>

                            {/* Danh sách sản phẩm - Nổi bật hơn với Hover */}
                            <div className="space-y-4 mb-4 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-5 group items-center">
                                        <div className={`relative w-20 h-20 overflow-hidden border transition-all duration-500 rounded-2xl p-1
                        ${isDark ? 'bg-zinc-800 border-white/5 group-hover:border-amber-500/50' : 'bg-white border-zinc-100 group-hover:border-amber-500/50'}`}>
                                            <img
                                                src={item.image_url}
                                                alt={item.name}
                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <h4 className={`text-[12px] font-bold  line-clamp-1 ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                                                {item.name}
                                            </h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[10px] text-zinc-500 font-bold">Số lượng: {item.quantity}</span>
                                                <span className={`text-[13px] font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                                    {formatCurrency(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Phần tính toán chi phí */}
                            <div className={`space-y-4 mb-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-zinc-500 font-medium">Tạm tính</span>
                                    <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{formatCurrency(cartSubtotal)}</span>
                                </div>

                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-zinc-500 font-medium">Phí vận chuyển</span>
                                    <span className={`font-bold ${shippingFee === 0 ? 'text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded-full text-[11px]' : (isDark ? 'text-zinc-200' : 'text-zinc-800')}`}>
                                        {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                                    </span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-[13px] animate-in fade-in slide-in-from-top-1">
                                        <span className="text-zinc-500 font-medium">Ưu đãi đặc quyền</span>
                                        <span className="font-bold text-red-500">-{formatCurrency(discountAmount)}</span>
                                    </div>
                                )}

                                {/* Tổng cộng với Gradient hoặc Highlight */}
                                <div className={`pt-2 mt-6 border-t-2 border-dashed flex justify-between items-center ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                                    <span className={`text-[11px] uppercase font-black ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Tổng cộng</span>
                                    <span className="text-3xl font-black text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                        {formatCurrency(cartTotal)}
                                    </span>
                                </div>
                            </div>

                            {/* Input Voucher - Thiết kế lại tối giản & sang trọng */}
                            <div className="mb-8">
                                <div className="flex h-10 relative overflow-hidden rounded-xl border border-zinc-500/20 group focus-within:border-amber-500/50 transition-all">
                                    <input
                                        type="text"
                                        placeholder="Mã ưu đãi"
                                        className={`flex-1 px-4 text-[12px] font-bold outline-none bg-transparent ${isDark ? 'text-white' : 'text-zinc-900'}`}
                                        value={voucherCodeInput}
                                        onChange={(e) => setVoucherCodeInput(e.target.value)}
                                    />
                                    <button
                                        onClick={appliedVoucher ? () => { /* remove logic */ } : handleApplyVoucher}
                                        className={`px-6 text-[12px] font-bold uppercase transition-all 
                        ${appliedVoucher
                                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
                                                : 'bg-zinc-900 text-white hover:bg-amber-600'}`}
                                    >
                                        {appliedVoucher ? 'Hủy' : 'Áp dụng'}
                                    </button>
                                </div>
                            </div>

                            {/* Button chính - Hiệu ứng Shine rực rỡ */}
                            <Button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full h-16 rounded-2xl group relative overflow-hidden bg-amber-500 hover:bg-amber-600 border-none shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <div className="flex items-center justify-center gap-3 relative z-10">
                                    <span className="text-[12px] uppercase font-black text-white">Xác nhận thanh toán</span>
                                    <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-2" />
                                </div>
                            </Button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
