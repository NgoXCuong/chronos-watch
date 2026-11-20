import CartQuantityControl from './CartQuantityControl';
import { Link } from 'react-router-dom';
import { ArrowUpRight, PackageCheck, Trash2, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { formatCurrency } from '../../utils/formatCurrency';
import { cn } from '../../lib/utils';

export default function CartItemRow({ item, flash, unitPrice, onRemove, onQuantityChange }) {
    const stock = item.stock == null ? null : Math.max(0, Number(item.stock) || 0);
    const lineTotal = unitPrice * item.quantity;
    return (
        <article className="cart-item">
            <Link to={`/products/${item.slug}`} className="cart-item-image group">
                <img src={item.image_url} alt={item.name} loading="lazy" className="size-full object-contain transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
                <span className="cart-image-arrow"><ArrowUpRight size={15} aria-hidden="true" /></span>
            </Link>
            <div className="cart-item-content">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">{item.brand?.name || 'Chronos selection'}</p>
                        <Link to={`/products/${item.slug}`} className="mt-2 block text-base font-semibold leading-snug tracking-tight text-foreground hover:text-primary md:text-lg">{item.name}</Link>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} aria-label={`Xóa ${item.name} khỏi giỏ`} className="size-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"><Trash2 size={16} /></Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="tabular-nums text-muted-foreground">{formatCurrency(unitPrice)} / chiếc</span>
                    {stock !== null && <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold tabular-nums', stock === 0 || item.quantity > stock ? 'border-sale/25 bg-sale-soft text-sale' : 'border-navy-300 bg-navy-100 text-navy-800 dark:border-navy-500 dark:bg-navy-800 dark:text-navy-100')}><PackageCheck size={14} aria-hidden="true" />{stock > 0 ? `Còn ${stock} sản phẩm` : 'Hết hàng'}</span>}
                    {flash && <span className="inline-flex items-center gap-1 rounded-md bg-sale-soft px-2 py-1 text-[10px] font-semibold text-sale"><Zap size={11} /> Flash Sale · còn {flash.remaining} suất</span>}
                </div>
                <div className="cart-item-bottom">
                    <CartQuantityControl key={`${item.id}:${item.quantity}:${stock}`} quantity={item.quantity} stock={stock} name={item.name} onCommit={(quantity) => onQuantityChange(item.id, quantity)} />
                    <div className="cart-line-total text-right">
                        <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Thành tiền</p>
                        <p className={cn('text-xl font-bold tabular-nums tracking-tight', flash ? 'text-sale' : 'text-foreground')}>{formatCurrency(lineTotal)}</p>
                    </div>
                </div>
            </div>
        </article>
    );
}
