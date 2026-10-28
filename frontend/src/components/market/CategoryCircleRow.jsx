import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { categoryIcon } from '../../constants/categoryIcons';

const FALLBACK = [
    { id: '1', name: 'Đồng hồ nam', slug: 'nam' },
    { id: '2', name: 'Đồng hồ nữ', slug: 'nu' },
    { id: '3', name: 'Automatic', slug: 'automatic' },
    { id: '4', name: 'Smartwatch', slug: 'smartwatch' },
    { id: '5', name: 'Limited Edition', slug: 'limited' },
];

/** Hàng icon tròn danh mục kiểu sàn: navy-50 → hover nền navy-600 chữ trắng. */
const CategoryCircleRow = ({ categories = [], loading }) => {
    const items = (categories.length > 0 ? categories : FALLBACK).slice(0, 9);
    if (loading && categories.length === 0) return null;

    return (
        <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-5 md:justify-between md:gap-4">
            {items.map((cat, idx) => {
                const Icon = categoryIcon(cat);
                const key = cat._id || cat.id || `cat-${idx}`;
                return (
                    <Link
                        key={key}
                        to={`/products?category=${cat.slug || key}`}
                        className="group flex w-20 flex-col items-center gap-2"
                    >
                        <span className="flex size-16 items-center justify-center rounded-full border border-border bg-navy-50 text-navy-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-navy-600 group-hover:text-white group-hover:shadow-hover">
                            <Icon size={24} strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="line-clamp-2 text-center text-xs font-medium text-foreground/90 group-hover:text-navy-600">
                            {cat.name}
                        </span>
                    </Link>
                );
            })}
            <Link to="/products" className="group flex w-20 flex-col items-center gap-2">
                <span className="flex size-16 items-center justify-center rounded-full border border-dashed border-navy-300 text-navy-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-solid group-hover:bg-navy-600 group-hover:text-white group-hover:shadow-hover">
                    <Plus size={24} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="text-center text-xs font-medium text-foreground/90 group-hover:text-navy-600">Xem thêm</span>
            </Link>
        </div>
    );
};

export default CategoryCircleRow;
