import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import VoucherControl from '../vouchers/VoucherControl';
import { formatCurrency } from '../../utils/formatCurrency';
import { cn } from '../../lib/utils';

const Row = ({ label, value, tone }) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-semibold tabular-nums', tone || 'text-foreground')}>{value}</span>
    </div>
);

/** Bảng tóm tắt bên phải trang thanh toán: danh sách hàng, số tiền, mã ưu đãi và nút đặt đơn. */
const CheckoutSummary = ({ cart, unitPriceOf, cartSubtotal, discountAmount, total, submitting, onSubmit, ...voucher }) => (
    <aside className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="border-b border-border pb-3 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">Đơn hàng của bạn</h2>

        <ul className="max-h-72 space-y-3 overflow-y-auto py-4 pr-1">
            {cart.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-navy-50 p-1">
                        <img src={item.image_url} alt="" className="size-full object-contain" />
                        <span className="absolute -right-0 -top-0 flex size-4 items-center justify-center rounded-full bg-navy-600 text-[11px] font-bold tabular-nums text-white">
                            {item.quantity}
                        </span>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">{item.name}</span>
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-navy-700">{formatCurrency(unitPriceOf(item) * item.quantity)}</span>
                </li>
            ))}
        </ul>

        <div className="space-y-2.5 border-t border-border pt-4">
            <Row label="Tạm tính" value={formatCurrency(cartSubtotal)} />
            <Row label="Phí vận chuyển" value="Miễn phí" tone="text-success" />
            {discountAmount > 0 && <Row label="Mã ưu đãi" value={`− ${formatCurrency(discountAmount)}`} tone="text-sale" />}
        </div>

        <div className="mt-4 border-t border-dashed border-border pt-4">
            <div className="flex items-end justify-between gap-3">
                <span className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">Tổng cộng</span>
                <span className="text-2xl font-bold tabular-nums text-navy-700">{formatCurrency(total)}</span>
            </div>
        </div>

        <div className="mt-4">
            <VoucherControl />
        </div>

        <Button onClick={onSubmit} disabled={voucher.applyingVoucher} loading={submitting} size="full" className="mt-4 w-full gap-2">
            <ShoppingBag size={16} strokeWidth={2} aria-hidden="true" />
            Xác nhận đặt hàng
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Button>

        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
            Chronos giữ hàng tối đa 2 ngày. Đơn chuyển khoản chỉ được ghi nhận khi nhận đủ tiền.
        </p>
    </aside>
);

export default CheckoutSummary;
