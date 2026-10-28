import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShoppingCart } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { formatCurrency } from '../../utils/formatCurrency';
import { flashSoldPercent } from '../../utils/flashSale';
import anhminhhoa from '../../assets/anh-minh-hoa.jpg';

/**
 * Thẻ sản phẩm Flash Sale (khác ProductCard thường ở chỗ nói rõ SUẤT: đã bán bao
 * nhiêu / còn bao nhiêu). `item` là dòng đã decorate từ /flash-sales/current:
 * { flash_price, quota, sold_count, remaining, discount_percent, sold_out, product }.
 */
export const FlashProductCard = ({ item }) => {
    const product = item?.product;
    if (!product) return null;

    const name = product.name || 'Chronos Watch';
    const slug = product.slug || '#';
    const image = product.image_url || anhminhhoa;
    const percent = flashSoldPercent(item);
    const soldOut = item.sold_out || Number(item.remaining) <= 0;
    const lastFew = !soldOut && Number(item.remaining) <= 3;

    return (
        <div
            className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 ${
                soldOut ? '' : 'hover:-translate-y-0.5 hover:shadow-hover'
            }`}
        >
            {Number(item.discount_percent) > 0 && (
                <div className="absolute top-3 left-3 z-10 rounded-md bg-sale-soft px-2 py-1 text-[11px] font-extrabold uppercase text-sale">
                    -{Number(item.discount_percent)}%
                </div>
            )}

            <Link to={`/products/${slug}`} className={`relative block overflow-hidden bg-navy-50 ${soldOut ? 'opacity-50' : ''}`} style={{ aspectRatio: '1' }}>
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {soldOut && (
                    <span className="absolute inset-x-0 bottom-0 bg-navy-900/85 py-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-white">
                        Cháy hàng
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col p-3">
                <Link to={`/products/${slug}`}>
                    <h3 className="mb-1.5 line-clamp-2 text-xs font-medium leading-snug text-card-foreground transition-colors hover:text-navy-600">
                        {name}
                    </h3>
                </Link>

                <div className="mb-2 flex items-baseline gap-1.5">
                    <span className="text-[15px] font-extrabold tabular-nums text-navy-600">{formatCurrency(item.flash_price)}</span>
                    {Number(item.list_price ?? product.price) > Number(item.flash_price) && (
                        <span className="text-[11px] line-through tabular-nums text-muted-foreground">
                            {formatCurrency(Number(item.list_price ?? product.price))}
                        </span>
                    )}
                </div>

                <div className="mt-auto space-y-1.5">
                    <div className="h-1.5 overflow-hidden rounded-full bg-navy-100" role="presentation">
                        <div
                            className={`h-full rounded-full ${soldOut ? 'bg-muted-foreground' : 'bg-sale'}`}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-[10.5px] font-semibold tabular-nums">
                        <span className="text-muted-foreground">
                            Đã bán {Number(item.sold_count) || 0}/{Number(item.quota) || 0}
                        </span>
                        {soldOut ? (
                            <span className="text-muted-foreground">Hết suất</span>
                        ) : (
                            <span className={`flex items-center gap-1 ${lastFew ? 'text-sale' : 'text-navy-600'}`}>
                                {lastFew && <Flame size={10} strokeWidth={2.5} aria-hidden="true" />}
                                còn {Number(item.remaining)} suất
                            </span>
                        )}
                    </div>
                </div>

                <Link
                    to={`/products/${slug}`}
                    aria-disabled={soldOut}
                    className={buttonVariants({
                        variant: soldOut ? 'outline' : 'buy',
                        size: 'sm',
                        className: `mt-2 w-full justify-center ${soldOut ? 'pointer-events-none opacity-60' : ''}`,
                    })}
                >
                    <ShoppingCart size={13} strokeWidth={2} aria-hidden="true" />
                    <span>{soldOut ? 'Hết suất' : 'Mua ngay'}</span>
                </Link>
            </div>
        </div>
    );
};

export default FlashProductCard;
