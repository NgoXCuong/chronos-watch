import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem, Ticket, Truck } from 'lucide-react';

const PROMOS = [
    {
        icon: Gem,
        title: 'Bộ sưu tập cao cấp',
        sub: 'Đính đá & giới hạn — dành riêng cho quý ông',
        to: '/products?category=limited',
    },
    {
        icon: Ticket,
        title: 'Mã giảm giá 15%',
        sub: 'Cho đơn hàng đầu tiên trên 500.000₫',
        to: '/products',
    },
    {
        icon: Truck,
        title: 'Giao hỏa tốc 4h',
        sub: 'Nội thành Hà Nội & TP.HCM trong ngày',
        to: '/about',
    },
];

/** 3 banner khuyến mãi gọn kiểu sàn TMĐT (icon + chữ + CTA mũi tên). */
const PromoBanner = () => (
    <div className="grid gap-4 md:grid-cols-3">
        {PROMOS.map(({ icon: Icon, title, sub, to }) => (
            <Link
                key={title}
                to={to}
                className="group flex items-center gap-4 rounded-xl border border-border bg-linear-to-r from-navy-50 to-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover"
            >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-600 text-white">
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold uppercase text-navy-900">{title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{sub}</span>
                </span>
                <ArrowRight size={18} strokeWidth={2} className="shrink-0 text-navy-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
        ))}
    </div>
);

export default PromoBanner;
