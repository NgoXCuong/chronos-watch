import { ArrowRight, BadgePercent, ShoppingBag, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { formatCurrency } from '../../utils/formatCurrency';
import { cn } from '../../lib/utils';

const Row = ({ label, value, tone }) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-semibold tabular-nums', tone || 'text-foreground')}>{value}</span>
    </div>
);

const VoucherField = ({ voucherCode, setVoucherCode, appliedVoucher, applyingVoucher, applyVoucher, removeVoucher }) => {
    if (appliedVoucher) {
        return (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-navy-200 bg-navy-50 px-3 py-2">
                <span className="flex min-w-0 items-center gap-2 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">
                    <BadgePercent size={15} strokeWidth={2} className="shrink-0" aria-hidden="true" />
                    {appliedVoucher.code}
                </span>
                <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 px-2 text-sale" onClick={removeVoucher}>
                    <X size={13} strokeWidth={2} aria-hidden="true" />
                    Bỏ mã
                </Button>
            </div>
        );
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                applyVoucher();
            }}
            className="flex gap-2"
        >
            <Input
                value={voucherCode}
                onChange={(event) => setVoucherCode(event.target.value)}
                placeholder="Mã ưu đãi"
                className="h-10 flex-1"
                autoComplete="off"
            />
            <Button type="submit" variant="buy" size="sm" disabled={applyingVoucher} className="h-10 shrink-0 rounded-lg px-4">
                {applyingVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
            </Button>
        </form>
    );
};

/** Bảng tóm tắt bên phải trang thanh toán: danh sách hàng, số tiền, mã ưu đãi và nút đặt đơn. */
const CheckoutSummary = ({ cart, unitPriceOf, cartSubtotal, shippingFee, discountAmount, total, submitting, onSubmit, ...voucher }) => (
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
            <Row label="Phí vận chuyển" value={shippingFee > 0 ? formatCurrency(shippingFee) : 'Miễn phí'} tone={shippingFee > 0 ? undefined : 'text-success'} />
            {discountAmount > 0 && <Row label="Mã ưu đãi" value={`− ${formatCurrency(discountAmount)}`} tone="text-sale" />}
        </div>

        <div className="mt-4 border-t border-dashed border-border pt-4">
            <div className="flex items-end justify-between gap-3">
                <span className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">Tổng cộng</span>
                <span className="text-2xl font-bold tabular-nums text-navy-700">{formatCurrency(total)}</span>
            </div>
        </div>

        <div className="mt-4">
            <VoucherField {...voucher} />
        </div>

        <Button onClick={onSubmit} loading={submitting} size="full" className="mt-4 w-full gap-2">
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
