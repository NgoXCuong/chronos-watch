import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { brandDescription, brandHref, brandProductCount } from '../../../utils/brandCatalog';
import BrandLogo from './BrandLogo';

export default function BrandCard({ brand, index = 0 }) {
    const count = brandProductCount(brand);
    return (
        <Link to={brandHref(brand)} className="brand-catalog-card group">
            <div className="brand-card-showcase">
                <span className="brand-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')} / CHRONOS</span>
                <BrandLogo brand={brand} />
            </div>
            <div className="brand-card-body">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[22px] font-semibold tracking-tight">{brand.name}</h3>
                    {brand.country && <span className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">{brand.country}</span>}
                </div>
                <p className="brand-card-description">{brandDescription(brand)}</p>
                <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
                    <span className="text-xs tabular-nums text-muted-foreground">{count > 0 ? `${count} sản phẩm` : 'Chưa mở bán'}</span>
                    <span className="flex items-center gap-2 text-xs font-semibold text-foreground">{count > 0 ? 'Khám phá bộ sưu tập' : 'Xem thương hiệu'}<ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" /></span>
                </div>
            </div>
        </Link>
    );
}
