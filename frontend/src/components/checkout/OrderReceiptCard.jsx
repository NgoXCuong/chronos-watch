import { Calendar, CreditCard, MapPin, Phone } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { PAYMENT_LABEL } from '../../constants/checkout';
import { cn } from '../../lib/utils';

const Cell = ({ icon: Icon, title, className, children }) => (
    <div className={cn('space-y-2', className)}>
        <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.02em] text-navy-700">
            {Icon && <Icon size={15} strokeWidth={2} className="text-navy-500" aria-hidden="true" />}
            {title}
        </h3>
        {children}
    </div>
);

const Line = ({ label, value, tone }) => (
    <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-semibold tabular-nums text-foreground', tone)}>{value}</span>
    </div>
);

/** Hóa đơn tóm tắt của đơn vừa đặt: mã đơn, giao nhận, thanh toán và số tiền. */
const OrderReceiptCard = ({ order }) => {
    const paid = order.payment_status === 'paid';

    return (
        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">Mã đơn hàng</p>
                    <p className="text-xl font-bold tabular-nums text-navy-700">{order.order_code || `#${order.id}`}</p>
                </div>
                <div className="text-right">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">Ngày đặt</p>
                    <p className="flex items-center justify-end gap-1.5 text-sm font-bold text-foreground">
                        <Calendar size={14} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
                        {formatDate(order.created_at || order.createdAt)}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 md:gap-4">
                <Cell icon={MapPin} title="Giao đến">
                    <p className="text-sm font-bold text-foreground">{order.full_name}</p>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{order.address_line}</p>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                        {[order.ward, order.district, order.city].filter(Boolean).join(', ')}
                    </p>
                    <p className="flex items-center gap-1.5 text-[13px] tabular-nums text-muted-foreground">
                        <Phone size={13} strokeWidth={2} aria-hidden="true" />
                        {order.phone_number}
                    </p>
                </Cell>

                <Cell icon={CreditCard} title="Thanh toán" className="md:border-l md:border-border md:pl-4">
                    <p className="text-sm font-bold text-foreground">{PAYMENT_LABEL[order.payment_method] || order.payment_method}</p>
                    <span
                        className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.02em]',
                            paid ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
                        )}
                    >
                        <span className={cn('size-1.5 rounded-full', paid ? 'bg-success' : 'bg-warning')} aria-hidden="true" />
                        {paid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                </Cell>

                <Cell title="Tiền hàng" className="space-y-1.5 md:border-l md:border-border md:pl-4">
                    <Line label="Tạm tính" value={formatCurrency(order.subtotal)} />
                    <Line
                        label="Phí vận chuyển"
                        value={Number(order.shipping_fee) > 0 ? formatCurrency(order.shipping_fee) : 'Miễn phí'}
                        tone={Number(order.shipping_fee) > 0 ? '' : 'text-success'}
                    />
                    {Number(order.discount_amount) > 0 && <Line label="Giảm giá" value={`− ${formatCurrency(order.discount_amount)}`} tone="text-sale" />}
                    <div className="flex items-end justify-between gap-3 border-t border-dashed border-border pt-3">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">Tổng cộng</span>
                        <span className="text-lg font-bold tabular-nums text-navy-700">{formatCurrency(order.total_amount)}</span>
                    </div>
                </Cell>
            </div>
        </section>
    );
};

export default OrderReceiptCard;
