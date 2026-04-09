import React from 'react';
import { Minus, Plus, ShoppingCart, CreditCard, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

const ProductActions = ({ product, quantity, setQuantity, isDark }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    // Handling quantity selection with stock limits
    const handleDecrement = () => setQuantity(Math.max(1, quantity - 1));
    const handleIncrement = () => {
        if (product.stock > quantity) {
            setQuantity(quantity + 1);
        }
    };

    const isOutOfStock = product.stock <= 0;
    const activeWishlist = isInWishlist(product.id);

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    return (
        <div className="space-y-6 pt-4">
            {/* Primary Actions Row */}
            <div className="flex flex-col sm:flex-row gap-4">

                {/* Quantity Selector */}
                <div className={`flex items-center h-12 border transition-all duration-300
                    ${isDark
                        ? 'border-white/10 bg-white/[0.03]'
                        : 'border-zinc-200 bg-zinc-50'
                    }
                    ${isOutOfStock ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                >
                    <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className={`w-12 h-full flex items-center justify-center transition-all
                            ${isDark ? 'hover:bg-white/5 text-zinc-500 hover:text-white' : 'hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900'}
                            disabled:opacity-20`}
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-10 flex items-center justify-center">
                        <span className={`text-sm font-bold tabular-nums ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            {quantity.toString().padStart(2, '0')}
                        </span>
                    </div>

                    <button
                        onClick={handleIncrement}
                        disabled={quantity >= product.stock}
                        className={`w-12 h-full flex items-center justify-center transition-all
                            ${isDark ? 'hover:bg-white/5 text-zinc-500 hover:text-white' : 'hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900'}
                            disabled:opacity-20`}
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Add to Collection Button */}
                <Button
                    variant="primary"
                    disabled={isOutOfStock}
                    className="flex-1 h-12"
                    onClick={handleAddToCart}
                >
                    <div className="flex items-center justify-center gap-3">
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Hiện đã hết hàng' : 'Thêm vào bộ sưu tập'}</span>
                    </div>
                </Button>

                {/* Wishlist Button */}
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-12 h-12 flex items-center justify-center border transition-all duration-300
                        ${activeWishlist
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : (isDark
                                ? 'border-white/10 bg-white/[0.03] text-zinc-500 hover:text-amber-500 hover:border-amber-500/40'
                                : 'border-zinc-200 bg-zinc-50 text-zinc-400 hover:text-amber-600 hover:border-amber-400/60')
                        }`}
                >
                    <Heart className={`w-6 h-6 ${activeWishlist ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Buy Now Button */}
            <Button
                variant="outline"
                disabled={isOutOfStock}
                className="w-full h-12"
                onClick={handleBuyNow}
            >
                <div className="flex items-center justify-center gap-3">
                    <CreditCard className="w-4 h-4" />
                    <span>Mua ngay đặc quyền</span>
                </div>
            </Button>

            {/* Stock Notice */}
            {product.stock > 0 && product.stock <= 5 && (
                <p className={`text-[10px] uppercase font-bold text-amber-500 animate-pulse`}>
                    * Chỉ còn {product.stock} chiếc cuối cùng trong kho
                </p>
            )}
        </div>
    );
};

export default ProductActions;