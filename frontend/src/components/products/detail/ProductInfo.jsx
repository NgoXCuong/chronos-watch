import React from 'react';
import { Share2, Heart, Star, Eye, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { cn } from '../../../lib/utils';

const ProductInfo = ({ product, stockStatus, isDark, formatCurrency }) => {
    // Calculate Average Rating for Stars
    const averageRating = product.average_rating || 0;
    const totalReviews = product.review_count || 0;

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        size={10}
                        className={cn(
                            "transition-all duration-300",
                            s <= Math.round(rating)
                                ? "fill-amber-500 text-amber-500"
                                : "text-zinc-200 dark:text-zinc-800"
                        )}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="mb-4 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-5">
                <Badge variant="outline" className="rounded-none border-amber-500/30 text-amber-500 text-[12px] px-2.5 py-0.5 uppercase font-black">
                    {product.brand?.name || 'Grand Collection'}
                </Badge>
                <div className="flex gap-3">
                    <button className={cn(
                        "p-2 rounded-full transition-all duration-300",
                        isDark ? 'text-zinc-600 hover:text-white hover:bg-white/5' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
                    )}>
                        <Share2 size={14} />
                    </button>
                    <button className={cn(
                        "p-2 rounded-full transition-all duration-300",
                        isDark ? 'text-zinc-600 hover:text-amber-500 hover:bg-amber-500/5' : 'text-zinc-400 hover:text-red-500 hover:bg-red-50'
                    )}>
                        <Heart size={14} />
                    </button>
                </div>
            </div>

            <h1
                className={`text-xl md:text-3xl font-black mb-6 leading-[1.1] uppercase ${isDark ? 'text-white' : 'text-zinc-950'}`}
                style={{ fontFamily: 'Roboto, sans-serif' }}
            >
                {product.name}
            </h1>

            <div className="flex items-center gap-6 pb-8 border-b dark:border-white/5 border-zinc-100">
                <div className="flex items-center gap-4">
                    {renderStars(averageRating)}
                    <span className={cn(
                        "text-[12px] font-black ",
                        isDark ? 'text-zinc-700' : 'text-zinc-600'
                    )}>
                        {totalReviews} đánh giá
                    </span>
                </div>

                <span className="w-1 h-1 rounded-full bg-zinc-500 dark:bg-zinc-500"></span>

                <div className={cn("flex items-center gap-2 text-[12px] font-black", stockStatus.color)}>
                    {stockStatus.icon}
                    <span>{stockStatus.label}</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    {product.old_price && (
                        <span className={`text-md line-through ${isDark ? 'text-zinc-600' : 'text-zinc-500'} font-medium`}>
                            {formatCurrency(product.old_price)}
                        </span>
                    )}
                    <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-rose-500'}`}>
                        {formatCurrency(product.price)}
                    </span>
                </div>

                {/* Conditional Engagement Stats: Only show if > 0 */}
                {(product.views > 0 || product.sold_count > 0) && (
                    <div className="flex items-center gap-8">
                        {product.views > 0 && (
                            <div className="flex items-center gap-2.5 group">
                                <div className="p-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-transparent group-hover:border-amber-500/20 transition-all">
                                    <Eye size={14} className="text-zinc-400 group-hover:text-amber-500 transition-colors" />
                                </div>
                                <span className="text-[12px]  font-black text-zinc-500">
                                    {product.views} Lượt xem
                                </span>
                            </div>
                        )}

                        {product.sold_count > 0 && (
                            <div className="flex items-center gap-2.5 group">
                                <div className="p-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-transparent group-hover:border-emerald-500/20 transition-all">
                                    <ShoppingBag size={14} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                                <span className="text-[12px] font-black text-zinc-500 ">
                                    {product.sold_count} Đã bán
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductInfo;
