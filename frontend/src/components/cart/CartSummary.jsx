import { Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole, ShieldCheck, Truck } from 'lucide-react';
import { buttonVariants } from '../ui/button-variants';
import { formatCurrency } from '../../utils/formatCurrency';
import { cn } from '../../lib/utils';
import VoucherControl from '../vouchers/VoucherControl';
import { useCart } from '../../hooks/useCart';

const Row = ({ label, value, tone }) => (
    <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-medium tabular-nums', tone || 'text-foreground')}>{value}</span>
    </div>
);

// Mọi giá trị lấy từ CartContext; không trừ ưu đãi Flash Sale hai lần.
export default function CartSummary({ itemCount, listSubtotal, flashSavings, discountAmount, cartTotal }) {
    const { applyingVoucher } = useCart();
    return (
        <aside className="cart-summary">
            <div className="cart-summary-top">
                <p className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[.16em] text-navy-200">Đơn hàng của bạn <LockKeyhole size={14} aria-hidden="true" /></p>
                <h2 className="mt-5 text-sm text-navy-100">Tổng thanh toán</h2>
                <p className="mt-1 text-[32px] font-semibold tabular-nums tracking-tight text-white">{formatCurrency(cartTotal)}</p>
                <p className="mt-3 text-xs text-navy-200">{itemCount} sản phẩm · Miễn phí giao hàng</p>
            </div>
            <div className="p-5 md:p-6">
                <h3 className="text-[13px] font-semibold">Chi tiết thanh toán</h3>
                <div className="space-y-4 border-b border-border py-5">
                    <Row label={`Tạm tính (${itemCount} sản phẩm)`} value={formatCurrency(listSubtotal)} />
                    {flashSavings > 0 && <Row label="Tiết kiệm Flash Sale" value={`− ${formatCurrency(flashSavings)}`} tone="text-sale" />}
                    {discountAmount > 0 && <Row label="Ưu đãi" value={`− ${formatCurrency(discountAmount)}`} tone="text-sale" />}
                    <Row label="Vận chuyển" value={<span className="flex items-center gap-1.5"><Truck size={14} aria-hidden="true" />Miễn phí</span>} />
                </div>
                <div className="mt-5"><VoucherControl /></div>
                {applyingVoucher ? <p role="status" className="mt-5 text-center text-sm text-muted-foreground">Đang kiểm tra ưu đãi trước khi thanh toán…</p> : <Link to="/checkout" className={buttonVariants({ size: 'full', className: 'mt-5 gap-3' })}>Tiến hành thanh toán <ArrowRight size={16} aria-hidden="true" /></Link>}
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />Thông tin giao nhận và phương thức thanh toán được lựa chọn ở bước tiếp theo.</p>
            </div>
        </aside>
    );
}
