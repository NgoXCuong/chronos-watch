import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brandDescription, brandHref, brandProductCount } from '../../../utils/brandCatalog';

/**
 * Thẻ thương hiệu: logo thật từ Cloudinary, số sản phẩm do backend đếm (`product_count`).
 * Hãng chưa có sản phẩm nào vẫn hiển thị nhưng câu dẫn chuyển sang "tham khảo" — không hứa suông.
 */
const BrandCard = ({ brand }) => {
    const count = brandProductCount(brand);

    return (
        <Link
            to={brandHref(brand)}
            className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-hover"
        >
            <span className="flex h-24 items-center justify-center rounded-lg bg-navy-50 p-3">
                {brand.logo_url ? (
                    <img
                        src={brand.logo_url}
                        alt={`Logo ${brand.name}`}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <span className="text-2xl font-extrabold text-navy-600">{brand.name.charAt(0).toUpperCase()}</span>
                )}
            </span>

            <div className="mt-3 flex items-baseline justify-between gap-2">
                <h3 className="truncate text-[15px] font-bold text-foreground transition-colors group-hover:text-navy-600">{brand.name}</h3>
                {brand.country && <span className="shrink-0 text-[11px] text-muted-foreground">{brand.country}</span>}
            </div>

            <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">{brandDescription(brand)}</p>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-[12px] font-semibold uppercase tracking-[0.02em] text-navy-700 tabular-nums">
                    {count > 0 ? `${count} sản phẩm` : 'Chưa mở bán'}
                </span>
                <span className="flex items-center gap-1 text-[12px] font-semibold text-navy-600">
                    {count > 0 ? 'Xem bộ sưu tập' : 'Tham khảo'}
                    <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
            </div>
        </Link>
    );
};

export default BrandCard;
