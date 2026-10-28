import React from 'react';
import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../utils/formatCurrency';
import { stockStatusOf } from '../../../constants/productStock';
import Stars from './Stars';

/**
 * Khối thông tin chính: nhãn hãng (link về bộ lọc hãng), tên, sao + tình trạng kho,
 * giá THỰC TRẢ. Giá flash đến từ useProductFlash ở trang cha — cùng một mức với ô ưu đãi,
 * không để hai chỗ trên màn hình báo hai giá khác nhau.
 */
const ProductInfo = ({ product, flash }) => {
    const rating = Number(product.average_rating || 0);
    const reviews = Number(product.review_count || 0);
    const stock = stockStatusOf(product.stock);
    const StockIcon = stock.icon;

    const flashPrice = flash && !flash.sold_out && Number(flash.remaining) > 0 ? Number(flash.flash_price) : null;
    const sellingPrice = flashPrice ?? Number(product.price);
    const strikedPrice = flashPrice ? Number(product.price) : Number(product.old_price) || 0;

    const share = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Đã sao chép liên kết sản phẩm');
        } catch {
            toast.error('Trình duyệt không cho phép sao chép liên kết');
        }
    };

    return (
        <section className="mb-2">
            <div className="mb-3 flex items-start justify-between gap-3">
                <Badge variant="brand" className="rounded-md">
                    <Link to={`/products?brand=${product.brand_id}`} className="transition-colors hover:text-navy-600">
                        {product.brand?.name || 'Chronos'}
                    </Link>
                </Badge>
                <button
                    type="button"
                    onClick={share}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-navy-50 hover:text-navy-700"
                >
                    <Share2 size={13} strokeWidth={2} aria-hidden="true" />
                    Chia sẻ
                </button>
            </div>

            <h1 className="mb-4 text-xl font-bold leading-tight text-foreground md:text-3xl">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                    <Stars rating={rating} />
                    <span className="text-xs tabular-nums text-muted-foreground">
                        {rating > 0 ? rating.toFixed(1) : 'Chưa có đánh giá'}
                        {reviews > 0 && ` · ${reviews} đánh giá`}
                    </span>
                </div>
                <span className="hidden h-3 w-px bg-border sm:block" />
                <span className={cn('flex items-center gap-1.5 text-xs font-bold', stock.text)}>
                    <StockIcon size={14} strokeWidth={2} aria-hidden="true" />
                    {stock.label}
                </span>
                {product.sku && (
                    <>
                        <span className="hidden h-3 w-px bg-border sm:block" />
                        <span className="text-xs text-muted-foreground">
                            Mã SP: <span className="font-medium tabular-nums text-foreground/80">{product.sku}</span>
                        </span>
                    </>
                )}
            </div>

            <div className="mt-5 space-y-1.5">
                {strikedPrice > sellingPrice && (
                    <p className="text-sm font-medium text-muted-foreground line-through tabular-nums">{formatCurrency(strikedPrice)}</p>
                )}
                <p className={cn('text-2xl font-bold tabular-nums md:text-3xl', flashPrice ? 'text-sale' : 'text-navy-700')}>{formatCurrency(sellingPrice)}</p>
                {flashPrice && (
                    <p className="text-[12px] font-bold uppercase tracking-[0.02em] text-sale">
                        Giá Flash · tiết kiệm {formatCurrency(Number(product.price) - flashPrice)}
                    </p>
                )}
            </div>
        </section>
    );
};

export default ProductInfo;
