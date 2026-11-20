import { cn } from '../../../lib/utils';
import { uiTone } from '../../../constants/uiTones';

export default function CategoryMetric({ label, value, hint, icon: Icon, tone = 'navy' }) {
    const t = uiTone(tone);
    return <div title={hint} className={cn('relative overflow-hidden rounded-lg border px-3 py-2.5', t.block)}>
        <span className={cn('absolute inset-y-3 left-0 w-1 rounded-r-full', t.edge)} aria-hidden="true" />
        <div className="flex items-center justify-between gap-2"><p className="text-[11px] font-medium text-muted-foreground">{label}</p><Icon size={14} className={t.value} aria-hidden="true" /></div>
        <p className={cn('mt-1 text-xl font-semibold tracking-tight tabular-nums', t.value)}>{Number(value || 0).toLocaleString('vi-VN')}</p>

    </div>;
}
