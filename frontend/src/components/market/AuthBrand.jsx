import React from 'react';
import { Watch } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCENTS = {
    navy: 'bg-navy-100 text-navy-700',
    soft: 'bg-navy-50 text-navy-600',
    success: 'bg-success-soft text-success',
};

export function AuthBrand({ className }) {
    return (
        <div className={cn('flex items-center gap-2.5', className)}>
            <span className="flex size-9 items-center justify-center rounded-lg bg-navy-600 text-white shadow-card">
                <Watch size={20} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold uppercase tracking-[0.18em] text-navy-900 dark:text-foreground">
                Chronos
            </span>
        </div>
    );
}

export function AuthEyebrow({ icon: Icon, accent = 'navy', children }) {
    return (
        <span className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-[0.05em]',
            ACCENTS[accent]
        )}>
            {Icon && <Icon size={14} strokeWidth={2.5} aria-hidden="true" />}
            {children}
        </span>
    );
}

export function AuthTitle({ children }) {
    return (
        <h1 className="text-[28px] font-extrabold leading-tight text-navy-900 dark:text-foreground">
            {children}
        </h1>
    );
}

export function AuthSubtitle({ children }) {
    return <p className="mt-2 text-sm text-muted-foreground">{children}</p>;
}
