import { Truck, Wallet } from 'lucide-react';
import { PAYMENT_METHODS } from '../../constants/checkout';
import { cn } from '../../lib/utils';

const ICONS = { cod: Truck, sepay: Wallet };

/** Chọn phương thức thanh toán. Giá trị gửi lên backend: `cod` hoặc `sepay`. */
const PaymentMethodPicker = ({ value, onChange }) => (
    <section className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">
            <Wallet size={16} strokeWidth={2} className="text-navy-500" aria-hidden="true" />
            Phương thức thanh toán
        </h2>

        <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => {
                const Icon = ICONS[method.id];
                const checked = value === method.id;
                return (
                    <label
                        key={method.id}
                        className={cn(
                            'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all',
                            checked ? 'border-navy-600 bg-navy-50/70' : 'border-border bg-card hover:border-navy-300',
                        )}
                    >
                        <input
                            type="radio"
                            name="payment_method"
                            value={method.id}
                            checked={checked}
                            onChange={() => onChange(method.id)}
                            className="mt-1 size-4 shrink-0 accent-[color:var(--color-navy-600)]"
                        />
                        <Icon size={18} strokeWidth={2} className={cn('mt-0.5 shrink-0', checked ? 'text-navy-600' : 'text-muted-foreground')} aria-hidden="true" />
                        <span className="min-w-0">
                            <span className="block text-sm font-bold text-foreground">{method.label}</span>
                            <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">{method.desc}</span>
                        </span>
                    </label>
                );
            })}
        </div>
    </section>
);

export default PaymentMethodPicker;
