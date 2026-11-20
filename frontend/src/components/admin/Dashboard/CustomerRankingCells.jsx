import { Crown, UserRound } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../utils/formatCurrency';

export function CustomerRankCell({ rank }) {
    return (
        <span className={cn('inline-flex size-8 items-center justify-center rounded-lg text-xs font-bold tabular-nums', rank === 1 ? 'bg-navy-100 text-navy-700 dark:bg-navy-500/20 dark:text-navy-100' : 'bg-muted text-muted-foreground')}>
            {rank === 1 ? <Crown size={16} aria-label="Hạng 1" /> : `0${rank}`}
        </span>
    );
}

export function CustomerIdentityCell({ customer }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground">
                {customer.avatar_url ? <img src={customer.avatar_url} alt="" loading="lazy" className="size-full object-cover" /> : <UserRound size={17} aria-hidden="true" />}
            </span>
            <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">{customer.full_name || customer.username}</p>
                <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
            </div>
        </div>
    );
}

export function CustomerQuantityCell({ quantity }) {
    return <span className="font-bold tabular-nums text-foreground">{quantity.toLocaleString('vi-VN')} <span className="text-[11px] font-normal text-muted-foreground">chiếc</span></span>;
}

export function CustomerSpentCell({ total }) {
    return <span className="whitespace-nowrap text-[13px] font-semibold tabular-nums text-foreground">{formatCurrency(total)}</span>;
}
