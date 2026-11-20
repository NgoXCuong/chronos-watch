import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Đầu section chuẩn market: eyebrow nhỏ + tiêu đề lớn + link "Xem tất cả" phải. */
const SectionHead = ({ eyebrow, title, to = '/products', label = 'Xem tất cả', className }) => (
    <div className={cn('mb-5 flex flex-wrap items-end justify-between gap-3', className)}>
        <div className="space-y-1">
            {eyebrow && (
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
            )}
            <h2 className="text-xl font-extrabold tracking-tight text-foreground md:text-2xl">{title}</h2>
        </div>
        {to && (
            <Link
                to={to}
                className="group flex items-center gap-2 border-b border-border pb-1 text-[11px] font-semibold text-foreground transition-colors hover:text-primary"
            >
                {label}
                <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
        )}
    </div>
);

export default SectionHead;
