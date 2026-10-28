import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Một lựa chọn trong bảng lọc. checkable=false cho lựa chọn một giá trị (danh mục),
 * true cho chọn nhiều (thương hiệu, thông số) — ô vuông tự vẽ để cả hàng bấm được.
 */
const FilterOptionRow = ({ label, count, active, checkable = false, indent = 0, onClick, className }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
            'flex w-full items-center gap-2 rounded-lg py-1.5 pr-2 text-left text-[13px] leading-snug transition-colors',
            active ? 'font-semibold text-navy-700' : 'text-foreground/85 hover:text-navy-700',
            className
        )}
        style={{ paddingLeft: `${8 + indent * 14}px` }}
    >
        {checkable ? (
            <span
                className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors',
                    active ? 'border-navy-600 bg-navy-600 text-white' : 'border-input bg-card'
                )}
                aria-hidden="true"
            >
                {active && <Check size={11} strokeWidth={3} />}
            </span>
        ) : (
            <span className={cn('size-1.5 shrink-0 rounded-full', active ? 'bg-navy-600' : 'bg-transparent')} aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1 truncate" title={label}>
            {label}
        </span>
        {count != null && <span className={cn('shrink-0 text-[11px] tabular-nums', active ? 'text-navy-600' : 'text-muted-foreground')}>{count}</span>}
    </button>
);

export default FilterOptionRow;
