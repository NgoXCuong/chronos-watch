import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/button';

const WishlistPage = () => {
    const { wishlist, toggleWishlist, wishlistCount } = useWishlist();
    const { addToCart } = useCart();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    if (wishlistCount === 0) {
        return (
            <div className={`min-h-[70vh] flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
                <div className="w-20 h-20 rounded-full border border-zinc-500/10 flex items-center justify-center mb-8 text-zinc-300">
                    <Heart className="w-8 h-8 text-red-300" />
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: 'Georgia, serif' }}>Danh sách yêu thích trống</h2>
                <p className={`max-w-xs mx-auto mb-10 text-sm leading-relaxed ${isDark ? 'text-zinc-700' : 'text-zinc-600'}`}>
                    Lưu giữ những tuyệt phẩm bạn trân quý nhất tại đây để không bỏ lỡ khoảnh khắc sở hữu chúng.
                </p>
                <Link to="/products">
                    <Button variant="outline" className="px-10 h-14 rounded-none uppercase text-[14px] font-bold  transition-all">
                        Khám phá bộ sưu tập
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pb-20 ${isDark ? 'bg-[#080808]' : 'bg-white'}`}>
            <main className="max-w-[1400px] mx-auto px-6 pt-12 md:pt-20">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b dark:border-white/5 border-zinc-100 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4 animate-in fade-in duration-700">
                            <Heart className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[10px] uppercase font-black text-amber-500">Bộ Sưu Tập Riêng Tư</span>
                        </div>
                        <h1 className={`text-3xl md:text-4xl font-bold uppercase  ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            Yêu Thích <span className="text-zinc-700 ml-2 font-light">({wishlistCount})</span>
                        </h1>
                    </div>
                    <Link to="/products" className={`flex items-center gap-2 text-[10px] uppercase font-bold  transition-colors ${isDark ? 'text-zinc-700 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
                        <ArrowLeft className="w-3.5 h-3.5" /> Quay lại cửa hàng
                    </Link>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <div key={product.id} className={`group relative flex flex-col border p-5 transition-all duration-700
                            ${isDark ? 'border-white/5 bg-zinc-900/30' : 'border-zinc-100 bg-zinc-50/50 shadow-sm'}`}>

                            {/* Remove button */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                    ${isDark ? 'bg-black/40 text-zinc-700 hover:text-red-400' : 'bg-white/80 text-zinc-600 hover:text-red-500 shadow-sm'}`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            {/* Thumbnail */}
                            <Link to={`/products/${product.slug}`} className="block relative overflow-hidden bg-white mb-6" style={{ aspectRatio: '1' }}>
                                <img
                                    src={product.image_url || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                />
                                {product.old_price && (
                                    <div className="absolute top-0 left-0 bg-amber-600 text-white text-[12px] font-black px-2 py-1 uppercase er">
                                        Đặc Quyền
                                    </div>
                                )}
                            </Link>

                            <div className="flex flex-col flex-1">
                                <p className="text-[12px] text-amber-500 uppercase font-black  mb-2">
                                    {product.brand?.name || 'Grand Collection'}
                                </p>
                                <Link to={`/products/${product.slug}`}>
                                    <h3 className={`text-sm font-bold mb-4 line-clamp-2 transition-colors ${isDark ? 'text-white group-hover:text-amber-500' : 'text-zinc-900 group-hover:text-amber-600'}`}>
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="mt-auto pt-4 border-t dark:border-white/5 border-zinc-100 flex items-center justify-between gap-4">
                                    <div>
                                        <p className={`text-[12px] font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                            {formatCurrency(product.price)}
                                        </p>
                                        {product.old_price && (
                                            <p className="text-[10px] text-zinc-700 line-through">
                                                {formatCurrency(product.old_price)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            addToCart(product, 1);
                                            toggleWishlist(product); // Optional: remove from wishlist after adding to cart
                                        }}
                                        className={`p-3 rounded-none transition-all duration-300 relative overflow-hidden group/btn
                                            ${isDark ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
                                    >
                                        <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default WishlistPage;
