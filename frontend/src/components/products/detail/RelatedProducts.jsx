import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../../ui/ProductCard';

const RelatedProducts = ({ relatedProducts, isDark }) => {
    if (relatedProducts.length === 0) return null;

    return (
        <div className="mt-40">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                <div>
                    <h4 className="text-amber-500 text-[10px] uppercase font-bold mb-4">Gợi ý từ chuyên gia</h4>
                    <h2 className={`text-4xl md:text-5xl font-light ${isDark ? 'text-white' : 'text-zinc-900'}`} style={{ fontFamily: '"Playfair Display", serif' }}>
                        Tuyệt Phẩm Tương Đồng
                    </h2>
                </div>
                <Link to="/products" className={`group flex items-center gap-3 text-[10px] uppercase font-bold ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'} transition-all`}>
                    Xem tất cả tuyệt tác
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {relatedProducts.map(p => (
                    <ProductCard key={p.id || p._id} product={p} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
