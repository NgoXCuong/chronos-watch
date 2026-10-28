import { Check, ChevronRight } from 'lucide-react';
import { CHECKOUT_STEPS } from '../../constants/checkout';
import { cn } from '../../lib/utils';

/** Thanh tiến trình 3 bước dùng chung cho Giỏ hàng và Thanh toán. */
const CheckoutSteps = ({ current, className }) => (
    <ol className={cn('flex flex-wrap items-center justify-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.02em]', className)}>
        {CHECKOUT_STEPS.map((label, index) => (
            <li key={label} className="flex items-center gap-1.5">
                <span
                    className={cn(
                        'flex size-6 items-center justify-center rounded-full tabular-nums',
                        index < current
                            ? 'bg-success/10 text-success'
                            : index === current
                                ? 'bg-navy-600 text-white'
                                : 'bg-navy-50 text-navy-300',
                    )}
                >
                    {index < current ? <Check size={13} strokeWidth={2.5} aria-hidden="true" /> : index + 1}
                </span>
                <span className={index === current ? 'text-navy-700' : 'text-muted-foreground'}>{label}</span>
                {index < CHECKOUT_STEPS.length - 1 && <ChevronRight size={14} className="text-navy-200" aria-hidden="true" />}
            </li>
        ))}
    </ol>
);

export default CheckoutSteps;
