import { Crown, UserRound } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { rankingTone } from '../../../constants/rankingTones';
import { formatCurrency } from '../../../utils/formatCurrency';

export function CustomerRankCell({ rank }) {
    const tone = rankingTone(rank);
    return <span aria-label={`Hạng ${rank}`} className={cn('inline-flex h-9 min-w-9 shrink-0 items-center justify-center gap-1 rounded-lg px-2 text-xs font-bold tabular-nums shadow-sm', tone.chip)}>
        {rank === 1 && <Crown size={13} aria-hidden="true" />}{String(rank).padStart(2, '0')}
    </span>;
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
