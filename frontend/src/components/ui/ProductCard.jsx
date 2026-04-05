import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';

const ProductCard = ({ product }) => {
    const { theme } = useTheme();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isDark = theme === 'dark';

    // Map backend fields (snake_case) to component props
    const name = product?.name || 'Luxury Watch';
    const price = product?.price || 0;
    const originalPrice = product?.old_price || product?.originalPrice;
    const mainImage = product?.image_url || (product?.images && product?.images[0]) || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800';
    const slug = product?.slug || '#';
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : null;
    const activeWishlist = isInWishlist(product.id);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    return (
        <div className={`group relative border overflow-hidden flex flex-col transition-all duration-500 h-full ${isDark
            ? 'bg-zinc-900 border-white/5 hover:border-amber-500/30'
            : 'bg-white border-zinc-100 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/5 shadow-sm'
            }`}>
            {/* Discount badge */}
            {discount && (
                <div className="absolute top-3 left-3 z-10 bg-amber-600 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider">
                    -{discount}%
                </div>
            )}

            {/* Wishlist */}
            <button 
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center border backdrop-blur-sm transition-all duration-300 md:opacity-0 group-hover:opacity-100
                ${activeWishlist 
                    ? 'bg-amber-500 border-amber-500 text-white opacity-100' 
                    : (isDark 
                        ? 'bg-black/40 border-white/10 text-zinc-500 hover:text-amber-400 hover:border-amber-500/40' 
                        : 'bg-white/80 border-zinc-200 text-zinc-400 hover:text-amber-600 hover:border-amber-400/60 shadow-sm')
                }`}>
                <Heart className={`w-3.5 h-3.5 ${activeWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Image */}
            <Link to={`/products/${slug}`} className={`block relative overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-50'}`} style={{ aspectRatio: '1' }}>
                <img src={mainImage} alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                <p className="text-[9px] text-amber-500 uppercase mb-1.5 tracking-widest font-bold">
                    {product?.brand?.name || 'Chronos'}
                </p>
                <Link to={`/products/${slug}`}>
                    <h3 className={`text-sm font-medium line-clamp-2 mb-3 leading-snug transition-colors ${isDark
                        ? 'text-zinc-200 hover:text-white'
                        : 'text-zinc-700 hover:text-zinc-900'
                        }`}>{name}</h3>
                </Link>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{formatCurrency(price)}</p>
                            {originalPrice && <p className={`text-xs line-through ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>{formatCurrency(originalPrice)}</p>}
                        </div>
                    </div>

                    <Button
                        onClick={() => addToCart(product, 1)}
                        className={`w-full text-[10px] uppercase font-bold tracking-widest transition-all duration-300 py-5 ${isDark
                            ? 'bg-zinc-800 text-zinc-400 border-white/5 hover:bg-amber-600 hover:text-white hover:border-amber-500'
                            : 'bg-zinc-900 text-white hover:bg-amber-600 border-none'
                            }`}
                        variant="default"
                    >
                        <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                        Thêm Vào Giỏ
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
