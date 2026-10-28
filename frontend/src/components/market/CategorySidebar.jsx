import React from 'react';
import { Link } from 'react-router-dom';
import { List, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryIcon } from '../../constants/categoryIcons';

const FALLBACK = [
    { id: '1', name: 'Đồng hồ nam', slug: 'nam' },
    { id: '2', name: 'Đồng hồ nữ', slug: 'nu' },
    { id: '3', name: 'Automatic', slug: 'automatic' },
    { id: '4', name: 'Smartwatch', slug: 'smartwatch' },
    { id: '5', name: 'Limited Edition', slug: 'limited' },
];

/** Sidebar 230px kiểu sàn TMĐT: đầu navy "DANH MỤC SẢN PHẨM" + icon Lucide mỗi dòng. */
const CategorySidebar = ({ categories = [], loading, className }) => {
    const items = categories.length > 0 ? categories : loading ? [] : FALLBACK;

    return (
        <aside className={cn('w-[230px] shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-card', className)}>
            <h2 className="flex items-center gap-2 bg-navy-600 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
                <List size={16} strokeWidth={2} aria-hidden="true" />
                Danh mục sản phẩm
            </h2>
            <ul className="py-1">
                {items.slice(0, 10).map((cat, idx) => {
                    const Icon = categoryIcon(cat);
                    const key = cat._id || cat.id || `cat-${idx}`;
                    return (
                        <li key={key}>
                            <Link
                                to={`/products?category=${cat.slug || key}`}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-navy-50 hover:text-navy-700"
                            >
                                <Icon size={16} strokeWidth={2} className="shrink-0 text-navy-500" aria-hidden="true" />
                                <span className="min-w-0 flex-1 truncate">{cat.name}</span>
                                <ChevronRight size={14} strokeWidth={2} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                            </Link>
                        </li>
                    );
                })}
                {loading && (
                    <li className="space-y-2 px-4 py-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 animate-pulse rounded bg-navy-100" />
                        ))}
                    </li>
                )}
            </ul>
        </aside>
    );
};

export default CategorySidebar;
