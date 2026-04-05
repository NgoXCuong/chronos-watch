import React from 'react';
import { Share2, Heart, Star, Eye, ShoppingBag } from 'lucide-react';
import { Badge } from '../../ui/badge';

const ProductInfo = ({ product, stockStatus, isDark, formatCurrency }) => {
    return (
        <section className="mb-4">
            <div className="flex items-center justify-between mb-5">
                <Badge variant="outline" className="rounded-none border-amber-500/30 text-amber-500 text-[9px] px-2.5 py-0.5 uppercase font-bold">
                    {product.brand?.name || 'Grand Collection'}
                </Badge>
                <div className="flex gap-3">
                    <button className={`${isDark ? 'text-zinc-600 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'} transition-colors`}>
                        <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button className={`${isDark ? 'text-zinc-600 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'} transition-colors`}>
                        <Heart className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <h1
                className={`text-3xl md:text-4xl font-book mb-5 leading-[1.2] ${isDark ? 'text-white' : 'text-zinc-900'}`}
                style={{ fontFamily: '"Playfair Display", serif' }}
            >
                {product.name}
            </h1>

            <div className="flex items-center gap-5 mb-6 pb-6 border-b dark:border-white/5 border-zinc-100">
                <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    ))}
                </div>
                <div className="flex items-center gap-4 text-[9px] uppercase font-bold ">
                    <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>32 Reviews</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <div className={`flex items-center gap-1.5 ${stockStatus.color}`}>
                        {stockStatus.icon}
                        <span>{stockStatus.label}</span>
                    </div>
                </div>
            </div>

            <div className="mb-2">
                <div className="flex flex-col gap-1 mb-3">
                    {product.old_price && (
                        <span className={`text-xs line-through ${isDark ? 'text-zinc-600' : 'text-zinc-400'} font-medium`}>
                            {formatCurrency(product.old_price)}
                        </span>
                    )}
                    <span className={`text-4xl font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {formatCurrency(product.price)}
                    </span>
                </div>

                <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-[10px] uppercase font-bold text-zinc-500">{product.views || 0} Nhập cuộc</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-[10px] uppercase font-bold text-zinc-500">{product.sold_count || 0} Đã sở hữu</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductInfo;
