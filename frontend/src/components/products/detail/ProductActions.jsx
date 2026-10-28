import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingCart, Zap } from 'lucide-react';
import { Button } from '../../ui/button';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { cn } from '../../../lib/utils';
import { LOW_STOCK_THRESHOLD } from '../../../constants/productStock';

/**
 * Khối tác vụ mua: chọn số lượng (giới hạn theo kho thật), thêm giỏ, mua ngay (thêm giỏ
 * rồi sang /cart — chưa có checkout một bước) và yêu thích.
 */
const ProductActions = ({ product, quantity, setQuantity }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const outOfStock = Number(product.stock) <= 0;
    const wished = isInWishlist(product.id ?? product._id);
    const maxQty = Math.max(1, Number(product.stock) || 1);

    const step = (delta) => setQuantity((current) => Math.min(maxQty, Math.max(1, current + delta)));

    return (
        <div className="mt-6 space-y-3 border-t border-border pt-6">
            <div className="flex flex-wrap items-stretch gap-3">
                <div className={cn('flex h-11 items-center rounded-lg border border-border bg-card', outOfStock && 'pointer-events-none opacity-40')}>
                    <button
                        type="button"
                        onClick={() => step(-1)}
                        disabled={quantity <= 1}
                        aria-label="Giảm số lượng"
                        className="flex h-full w-10 items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-navy-50 hover:text-navy-700 disabled:opacity-30"
                    >
                        <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold tabular-nums text-foreground">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => step(1)}
                        disabled={quantity >= maxQty}
                        aria-label="Tăng số lượng"
                        className="flex h-full w-10 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-navy-50 hover:text-navy-700 disabled:opacity-30"
                    >
                        <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                </div>

                <Button variant="buy" disabled={outOfStock} onClick={() => addToCart(product, quantity)} className="h-11 flex-1 min-w-[160px]">
                    <ShoppingCart size={16} strokeWidth={2} aria-hidden="true" />
                    {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                </Button>

                <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-pressed={wished}
                    aria-label={wished ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                    className={cn(
                        'flex size-11 items-center justify-center rounded-lg border transition-colors',
                        wished ? 'border-navy-600 bg-navy-600 text-white' : 'border-border bg-card text-navy-300 hover:border-navy-600 hover:text-navy-600'
                    )}
                >
                    <Heart size={18} strokeWidth={2} className={wished ? 'fill-current' : ''} aria-hidden="true" />
                </button>
            </div>

            <Button disabled={outOfStock} onClick={() => { addToCart(product, quantity); navigate('/cart'); }} className="h-12 w-full text-[13px]">
                <Zap size={16} strokeWidth={2} aria-hidden="true" />
                Mua ngay
            </Button>

            {!outOfStock && Number(product.stock) <= LOW_STOCK_THRESHOLD && (
                <p className="text-xs font-semibold text-warning">
                    Chỉ còn {product.stock} chiếc trong kho — số lượng không được giữ sau khi rời trang.
                </p>
            )}
        </div>
    );
};

export default ProductActions;
