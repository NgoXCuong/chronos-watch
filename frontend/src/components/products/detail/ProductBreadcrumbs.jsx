import React from 'react';
import { Link } from 'react-router-dom';

const ProductBreadcrumbs = ({ product, isDark }) => {
    return (
        <div className={`border-b ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
                <nav className="flex items-center gap-3 text-[11px] uppercase font-medium">
                    <Link to="/" className={`${isDark ? 'text-zinc-500 hover:text-amber-500' : 'text-zinc-400 hover:text-amber-600'} transition-colors`}>Trang chủ</Link>
                    <span className="text-zinc-700">/</span>
                    <Link to="/products" className={`${isDark ? 'text-zinc-500 hover:text-amber-500' : 'text-zinc-400 hover:text-amber-600'} transition-colors`}>Bộ sưu tập</Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-amber-500 font-bold truncate max-w-[200px]">{product.name}</span>
                </nav>
            </div>
        </div>
    );
};

export default ProductBreadcrumbs;
