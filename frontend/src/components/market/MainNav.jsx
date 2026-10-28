import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NAV_LINKS = [
    { to: '/', label: 'Trang chủ', end: true },
    { to: '/products', label: 'Sản phẩm' },
    { to: '/#flash-sale', label: 'Flash Sale', badge: 'HOT', anchor: true },
    { to: '/brands', label: 'Thương hiệu' },
    { to: '/about', label: 'Về chúng tôi' },
];

export const Item = ({ link, className, onClick }) => {
    const inner = (
        <>
            {link.label}
            {link.badge && (
                <span className={cn(
                    'rounded px-1 py-px text-[11px] font-bold leading-none text-white',
                    link.badge === 'HOT' ? 'bg-sale' : 'bg-success',
                )}>
                    {link.badge}
                </span>
            )}
        </>
    );
    const cls = cn(
        'relative flex items-center gap-1.5 text-sm font-semibold uppercase transition-colors',
        className,
    );
    return link.anchor
        ? <a href={link.to} className={cls} onClick={onClick}>{inner}</a>
        : <NavLink to={link.to} end={link.end} className={cls} onClick={onClick}>{inner}</NavLink>;
};

/** Menu ngang chuẩn sàn: active chữ navy-600 + gạch chân 3px; badge HOT đỏ / NEW xanh. */
const MainNav = ({ className }) => (
    <nav className={cn('flex items-center gap-6', className)} aria-label="Điều hướng chính">
        {NAV_LINKS.map((link) => (
            <Item
                key={link.to}
                link={link}
                className={cn(
                    'py-3',
                    !link.anchor
                        ? '[&.active]:text-navy-600 [&.active]:after:absolute [&.active]:after:inset-x-0 [&.active]:after:-bottom-px [&.active]:after:h-[3px] [&.active]:after:rounded-full [&.active]:after:bg-navy-600'
                        : '',
                    'text-foreground/80 hover:text-navy-600',
                )}
            />
        ))}
    </nav>
);

export default MainNav;
