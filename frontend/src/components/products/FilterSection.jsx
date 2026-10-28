import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Một nhóm lọc gập được. Giữ state mở/đóng trong component (không phụ thuộc thuộc tính
 * `open` của DOM) để người dùng gập lại thì lọc thêm vẫn không tự bung mọi nhóm.
 * activeCount > 0 thì nhãn chuyển navy để nhìn thấy nhóm nào đang bật.
 */
const FilterSection = ({ title, icon: Icon, activeCount = 0, defaultOpen = true, children, className }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={cn('group border-b border-border px-4 py-3 last:border-b-0', className)}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center gap-2 py-1 text-left text-[13px] font-bold uppercase tracking-[0.02em] text-foreground"
            >
                {Icon && <Icon size={15} strokeWidth={2} className={cn('shrink-0', activeCount ? 'text-navy-600' : 'text-muted-foreground')} aria-hidden="true" />}
                <span className={cn('min-w-0 flex-1 truncate', activeCount && 'text-navy-700')}>{title}</span>
                {activeCount > 0 && (
                    <span className="shrink-0 rounded-md bg-navy-100 px-1.5 py-0.5 text-[11px] font-extrabold tabular-nums text-navy-700">{activeCount}</span>
                )}
                <ChevronDown size={15} strokeWidth={2} className={cn('shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
            </button>
            {open && <div className="pt-2 pb-1">{children}</div>}
        </div>
    );
};

export default FilterSection;

