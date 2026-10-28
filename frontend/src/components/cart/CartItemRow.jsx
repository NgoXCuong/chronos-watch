import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { cn } from '../../lib/utils';

const QtyButton = ({ disabled, label, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="flex size-8 items-center justify-center text-navy-600 transition-colors hover:bg-navy-50 disabled:pointer-events-none disabled:opacity-40"
    >
        {children}
    </button>
);

/** Một dòng sản phẩm trong giỏ. Giá hiển thị là giá THỰC TRẢ (đã trừ flash nếu có). */
const CartItemRow = ({ item, flash, unitPrice, onRemove, onQuantityChange }) => {
    const stock = Number(item.stock) > 0 ? Number(item.stock) : null;
    const maxQty = stock ? Math.max(1, Math.min(stock, 99)) : 99;
    const lineTotal = unitPrice * item.quantity;

    return (
        <div className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-card transition-shadow hover:shadow-hover md:gap-4 md:p-4">
            <Link to={`/products/${item.slug}`} className="size-20 shrink-0 overflow-hidden rounded-lg bg-navy-50 p-1 md:size-24">
                <img src={item.image_url} alt={item.name} loading="lazy" className="size-full object-contain" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-navy-500">{item.brand?.name || 'Chronos'}</p>
                        <Link to={`/products/${item.slug}`} className="mt-0.5 block truncate text-sm font-bold text-foreground transition-colors hover:text-navy-600">
                            {item.name}
                        </Link>
                        <p className="mt-1 text-[12px] tabular-nums text-muted-foreground">
                            {formatCurrency(unitPrice)} / chiếc
                            {stock !== null && <span className={cn('ml-2', item.quantity > stock ? 'text-sale' : 'text-muted-foreground')}>Kho: {stock}</span>}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Xóa ${item.name} khỏi giỏ`}
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border border-border bg-card">
                        <QtyButton label="Giảm số lượng" disabled={item.quantity <= 1} onClick={() => onQuantityChange(item.id, item.quantity - 1)}>
                            <Minus size={14} strokeWidth={2} aria-hidden="true" />
                        </QtyButton>
                        <span className="w-9 text-center text-sm font-bold tabular-nums text-foreground">{item.quantity}</span>
                        <QtyButton label="Tăng số lượng" disabled={item.quantity >= maxQty} onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
                            <Plus size={14} strokeWidth={2} aria-hidden="true" />
                        </QtyButton>
                    </div>

                    <div className="text-right">
                        <p className={cn('text-base font-bold tabular-nums', flash ? 'text-sale' : 'text-navy-700')}>{formatCurrency(lineTotal)}</p>
                        {flash && (
                            <p className="flex items-center justify-end gap-1 text-[12px] font-bold uppercase tracking-[0.02em] text-sale">
                                <Zap size={12} strokeWidth={2} aria-hidden="true" />
                                Flash · còn {flash.remaining} suất
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemRow;
