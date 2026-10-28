import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatCurrency';
import anhminhhoa from '../../assets/anh-minh-hoa.jpg';

/** Thẻ sản phẩm chuẩn market: badge giảm giá đỏ, wishlist, brand chip, sao navy, giá tabular-nums. */
const ProductCard = ({ product, compact = false }) => {
    const name = product?.name || 'Chronos Watch';
    const price = product?.price || 0;
    const originalPrice = product?.old_price || product?.originalPrice;
    const mainImage = product?.image_url || product?.images?.[0] || anhminhhoa;
    const slug = product?.slug || '#';
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : null;

    const { toggleWishlist, isInWishlist } = useWishlist();
    const activeWishlist = isInWishlist(product._id || product.id);
    const avgRating = Number(product?.average_rating || 0);

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover">
            {discount > 0 && (
                <div className="absolute top-3 left-3 z-10 rounded-md bg-sale-soft px-2 py-1 text-[11px] font-extrabold uppercase text-sale">
                    -{discount}%
                </div>
            )}

            <button
                onClick={() => toggleWishlist(product)}
                aria-label={activeWishlist ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
                className={`absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 ${
                    activeWishlist
                        ? 'border-navy-600 bg-navy-600 text-white opacity-100'
                        : 'border-border bg-card/80 text-navy-300 opacity-0 group-hover:opacity-100 hover:text-navy-600'
                }`}
            >
                <Heart size={14} strokeWidth={2} className={activeWishlist ? 'fill-current' : ''} aria-hidden="true" />
            </button>

            <Link to={`/products/${slug}`} className="relative block overflow-hidden bg-navy-50" style={{ aspectRatio: '1' }}>
                <img
                    src={mainImage}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className={`flex flex-1 flex-col ${compact ? 'p-3' : 'p-4'}`}>
                <span className="mb-1.5 self-start rounded-md bg-navy-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.05em] text-navy-700">
                    {product?.brand?.name || 'Chronos'}
                </span>
                <Link to={`/products/${slug}`}>
                    <h3 className={`line-clamp-2 font-medium leading-snug text-card-foreground transition-colors hover:text-navy-600 ${compact ? 'mb-1 text-xs' : 'mb-2 text-sm'}`}>
                        {name}
                    </h3>
                </Link>

                {!compact && (
                    <div className="mb-3 flex items-center gap-1">
                        <div className="flex items-center" aria-hidden="true">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={10}
                                    strokeWidth={2}
                                    className={i + 1 <= avgRating ? 'fill-amber-500 text-amber-500' : 'text-navy-200'}
                                />
                            ))}
                        </div>
                        <span className="ml-1 text-[12px] text-muted-foreground">({product?.review_count || 0})</span>
                    </div>
                )}

                <div className={`flex items-center justify-between gap-2 ${compact ? '' : 'mt-auto'}`}>
                    <div>
                        <p className="text-[15px] font-extrabold tabular-nums text-navy-600">{formatCurrency(price)}</p>
                        {originalPrice && (
                            <p className="text-xs line-through tabular-nums text-muted-foreground">{formatCurrency(originalPrice)}</p>
                        )}
                    </div>
                    <Link to={`/products/${slug}`} className={buttonVariants({ variant: 'buy', size: compact ? 'sm' : 'default' })}>
                        <ShoppingCart size={14} strokeWidth={2} aria-hidden="true" />
                        <span>Mua</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
