import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Đầu section chuẩn market: eyebrow nhỏ + tiêu đề lớn + link "Xem tất cả" phải. */
const SectionHead = ({ eyebrow, title, to = '/products', label = 'Xem tất cả', className }) => (
    <div className={cn('mb-5 flex items-end justify-between', className)}>
        <div className="border-l-4 border-navy-600 pl-3">
            {eyebrow && (
                <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-navy-500">{eyebrow}</p>
            )}
            <h2 className="text-xl font-extrabold text-foreground md:text-[22px]">{title}</h2>
        </div>
        {to && (
            <Link
                to={to}
                className="group flex items-center gap-2 text-xs font-semibold uppercase text-navy-600 transition-colors hover:text-navy-800"
            >
                {label}
                <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
        )}
    </div>
);

export default SectionHead;
