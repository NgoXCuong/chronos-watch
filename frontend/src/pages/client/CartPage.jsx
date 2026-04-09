import React from 'react';
import { Link } from 'react-router-dom';
import {
    Trash2, Minus, Plus, ArrowRight,
    ShoppingBag, ShieldCheck, Truck,
    RotateCcw, CreditCard
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

const CartPage = () => {
    const {
        cart, removeFromCart, updateQuantity,
        cartSubtotal, shippingFee, cartTotal
    } = useCart();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    if (cart.length === 0) {
        return (
            <div className={`min-h-[70vh] flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
                <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mb-8 animate-pulse text-amber-500">
                    <ShoppingBag className="w-10 h-10" />
                </div>
                <h2 className={`text-3xl font-bold mb-4  ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: 'Georgia, serif' }}>Bộ sưu tập đang trống</h2>
                <p className={`max-w-md mx-auto mb-10 text-sm leading-relaxed ${isDark ? 'text-zinc-700' : 'text-zinc-600'}`}>
                    Hãy bắt đầu hành trình tìm kiếm tuyệt phẩm thời gian của bạn. Những chiếc đồng hồ độc bản đang chờ được khám phá.
                </p>
                <Link to="/products">
                    <Button variant="primary" className="px-12 h-14 rounded-none uppercase text-[11px] font-black  transition-all">
                        Khám phá bộ sưu tập
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className={` pb-6 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            {/* --- Progress Steps --- */}
            <div className={`border-b ${isDark ? 'border-white/5 bg-zinc-900/20' : 'border-zinc-100 bg-zinc-50/50'}`}>
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-center gap-10 md:gap-20">
                    {[
                        { step: '01', label: 'Xem Giỏ Hàng', active: true },
                        { step: '02', label: 'Giao Nhận', active: false },
                        { step: '03', label: 'Thanh Toán', active: false }
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                            <span className={`text-[10px] font-black rounded-full bg-amber-500 w-6 h-6 flex items-center justify-center text-white`}>{s.step}</span>
                            <span className={`text-[10px] uppercase font-bold  transition-colors ${s.active ? (isDark ? 'text-white' : 'text-zinc-900') : 'text-zinc-700'}`}>
                                {s.label}
                            </span>
                            {i < 2 && <div className={`w-10 h-px hidden md:block ml-10 ${isDark ? 'bg-white/5' : 'bg-zinc-200'}`}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-6 pt-4 md:pt-8">
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

                    {/* --- Left Column: Items --- */}
                    <div className="flex-1">
                        <header className="flex items-center justify-between mb-10 pb-4 border-b dark:border-white/5 border-zinc-100">
                            <h1 className={`text-2xl font-bold uppercase  ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                Giỏ Hàng <span className="text-amber-500 ml-2">({cart.length})</span>
                            </h1>
                            <Link to="/products" className="text-[10px] uppercase font-bold text-amber-600 hover:text-amber-500 transition-colors">
                                Tiếp tục mua sắm →
                            </Link>
                        </header>

                        <div className="space-y-8">
                            {cart.map((item) => (
                                <div key={item.id} className={`group flex flex-col sm:flex-row gap-6 p-6 border transition-all duration-500
                                    ${isDark ? 'border-white/5 bg-zinc-900/30 hover:bg-zinc-900/50' : 'border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/30 font-medium'}`}>

                                    {/* Thumbnail */}
                                    <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 bg-white overflow-hidden relative">
                                        <img
                                            src={item.image_url || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800'}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Product Detail */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="text-[12px] text-amber-500 uppercase font-black  mb-1">
                                                    {item.brand?.name || 'Grand Collection'}
                                                </p>
                                                <Link to={`/products/${item.slug}`}>
                                                    <h3 className={`text-sm md:text-base font-bold mb-1 transition-colors ${isDark ? 'text-white group-hover:text-amber-500' : 'text-zinc-900 group-hover:text-amber-600'}`}>
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                <p className={`text-[10px] uppercase font-bold  ${isDark ? 'text-zinc-600' : 'text-zinc-600'}`}>
                                                    Mã SP: {item.id.toString().slice(-6).toUpperCase()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className={`p-2 transition-all ${isDark ? 'text-zinc-600 hover:text-red-400' : 'text-zinc-600 hover:text-red-500'}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap items-end justify-between mt-6 gap-6">
                                            {/* Quantity Picker */}
                                            <div className={`flex items-center h-10 border overflow-hidden ${isDark ? 'border-white/10 bg-black/40' : 'border-zinc-200 bg-white shadow-sm'}`}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className={`w-10 h-full flex items-center justify-center border-r hover:bg-amber-500 hover:text-white transition-all ${isDark ? 'border-white/5' : 'border-zinc-100'}`}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className={`w-8 text-center text-[11px] font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className={`w-10 h-full flex items-center justify-center border-l hover:bg-amber-500 hover:text-white transition-all ${isDark ? 'border-white/5' : 'border-zinc-100'}`}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Total Price */}
                                            <div className="text-right">
                                                <span className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-zinc-600' : 'text-zinc-600'}`}>Tạm tính</span>
                                                <span className={`text-base md:text-lg font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                                    {formatCurrency(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Right Column: Summary --- */}
                    <div className="w-full lg:w-[400px] xl:w-[450px]">
                        <div className={`sticky top-32 p-8 md:p-10 border transition-all duration-700
                            ${isDark
                                ? 'border-white/5 bg-zinc-900/40 backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]'
                                : 'border-zinc-100 bg-zinc-50/50 backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]'}`}>

                            <h2 className={`text-[12px] uppercase font-black mb-2 pb-4 border-b border-zinc-500/10 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                Tóm tắt đơn hàng
                            </h2>

                            <div className="space-y-4 mb-4">
                                <div className="flex justify-between items-center text-[13px] group">
                                    <span className={`transition-colors ${isDark ? 'text-zinc-700 group-hover:text-zinc-300' : 'text-zinc-700 group-hover:text-zinc-700'}`}>Tạm tính (Sản phẩm)</span>
                                    <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{formatCurrency(cartSubtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px] group hover:bg-emerald-50/50 p-1 -mx-1 rounded-md transition-all">
                                    <span className={cn(
                                        "flex items-center gap-2 transition-colors",
                                        isDark ? "text-zinc-400 group-hover:text-zinc-200" : "text-zinc-600 group-hover:text-zinc-900"
                                    )}>
                                        Vận chuyển <Truck className="w-3.5 h-3.5 text-emerald-500" />
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {/* Nếu bạn muốn hiện giá cũ bị gạch đi để kích thích mua hàng */}
                                        <span className="text-[11px] text-zinc-400 line-through font-medium">
                                            {formatCurrency(shippingFee || 30000)}
                                        </span>

                                        {/* Chữ MIỄN PHÍ nổi bật */}
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-100 shadow-sm animate-pulse">
                                            MIỄN PHÍ
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-[13px] group">
                                    <span className={`transition-colors ${isDark ? 'text-zinc-700 group-hover:text-zinc-300' : 'text-zinc-700 group-hover:text-zinc-700'}`}>Giảm giá (Ưu đãi)</span>
                                    <span className={`font-bold text-red-500`}>- {formatCurrency(0)}</span>
                                </div>
                                <div className={`pt-6 border-t font-black flex justify-between items-end ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] uppercase  mb-1 ${isDark ? 'text-zinc-700' : 'text-zinc-600'}`}>Tổng cộng cuối cùng</span>
                                        <span className={`text-2xl  text-amber-500 line-height-1`}>
                                            {formatCurrency(cartTotal)}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-zinc-700 italic font-medium">Bao gồm VAT</div>
                                </div>
                            </div>

                            <Link to="/checkout" className="block w-full">
                                <Button variant="primary" className="w-full h-12 rounded-none group relative overflow-hidden">
                                    <div className="flex items-center justify-center gap-3 relative z-10 transition-transform group-hover:scale-105">
                                        <CreditCard className="w-4 h-4" />
                                        <span className="text-[11px] uppercase font-black  leading-none">Tiến Hành Thanh Toán</span>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default CartPage;
