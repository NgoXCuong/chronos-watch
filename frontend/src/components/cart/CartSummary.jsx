import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../ui/button';
import { formatCurrency } from '../../utils/formatCurrency';
import { cn } from '../../lib/utils';

const Row = ({ label, value, tone }) => (
    <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-semibold tabular-nums', tone || 'text-foreground')}>{value}</span>
    </div>
);

/**
 * Tóm tắt đơn hàng trong giỏ. Số liệu lấy thẳng từ CartContext:
 * `listSubtotal` là giá niêm yết, `flashSavings` là phần đã trừ để ra `cartSubtotal`,
 * nên listSubtotal − flashSavings − discountAmount đúng bằng cartTotal (không trừ hai lần).
 */
const CartSummary = ({ itemCount, listSubtotal, flashSavings, discountAmount, shippingFee, cartTotal }) => (
    <aside className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="border-b border-border pb-3 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">Tóm tắt đơn hàng</h2>

        <div className="space-y-2.5 py-4">
            <Row label={`Tạm tính (${itemCount} sản phẩm)`} value={formatCurrency(listSubtotal)} />
            {flashSavings > 0 && <Row label="Tiết kiệm Flash Sale" value={`− ${formatCurrency(flashSavings)}`} tone="text-sale" />}
            {discountAmount > 0 && <Row label="Ưu đãi" value={`− ${formatCurrency(discountAmount)}`} tone="text-sale" />}
            <Row
                label="Phí vận chuyển"
                value={
                    <span className="flex items-center gap-1.5">
                        <Truck size={14} strokeWidth={2} className="text-success" aria-hidden="true" />
                        {shippingFee > 0 ? formatCurrency(shippingFee) : 'Miễn phí'}
                    </span>
                }
            />
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">Tổng cộng</p>
            <p className="text-2xl font-bold tabular-nums text-navy-700">{formatCurrency(cartTotal)}</p>
        </div>

        <Link to="/checkout" className="mt-4 block">
            <Button size="full" className="w-full gap-2">
                Tiến hành thanh toán
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
        </Link>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground">
            <ShieldCheck size={14} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
            Kiểm tra hàng trước khi nhận · đổi trả trong 7 ngày
        </p>
    </aside>
);

export default CartSummary;
