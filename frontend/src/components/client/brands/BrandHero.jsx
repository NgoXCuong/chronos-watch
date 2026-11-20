import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Globe2, Watch } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { brandHref, brandProductCount, countriesOf, totalProductsOf } from '../../../utils/brandCatalog';

export default function BrandHero({ brands, loading }) {
    const featured = [...brands].sort((a, b) => brandProductCount(b) - brandProductCount(a)).slice(0, 6);
    const stats = [
        { value: brands.length, label: 'Thương hiệu' },
        { value: countriesOf(brands).length, label: 'Quốc gia' },
        { value: totalProductsOf(brands), label: 'Sản phẩm' },
    ];
    return (
        <header className="brand-catalog-hero">
            <div className="brand-hero-copy">
                <p className="atelier-eyebrow">The brand collection</p>
                <h1 className="atelier-title mt-5">Những tên tuổi.<br /><span className="text-foreground">Những dấu ấn.</span></h1>
                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">Từ tinh thần chế tác Nhật Bản đến di sản đồng hồ Thụy Sĩ. Khám phá thương hiệu đồng điệu với phong cách của bạn.</p>
                <a href="#brand-directory" className="atelier-text-link mt-6">Khám phá các thương hiệu <ArrowDown /></a>
                <dl className="brand-hero-stats">
                    {stats.map(({ value, label }) => <div key={label}><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{loading ? '—' : value.toLocaleString('vi-VN')}</dd></div>)}
                </dl>
            </div>
            <div className="brand-logo-gallery">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.15em] text-muted-foreground"><Globe2 size={14} aria-hidden="true" /> A world of watchmaking</p>
                <div className="brand-hero-logos">
                    {loading ? Array.from({ length: 6 }, (_, i) => <div key={i} className="animate-pulse rounded-xl bg-card" />) : featured.map((brand) => (
                        <Link to={brandHref(brand)} key={brand.id} className="group brand-hero-logo" aria-label={`Khám phá ${brand.name}`}>
                            <BrandLogo brand={brand} /><ArrowUpRight size={13} className="brand-logo-arrow" aria-hidden="true" />
                        </Link>
                    ))}
                    {!loading && brands.length === 0 && <div className="col-span-2 flex min-h-52 items-center justify-center text-muted-foreground"><Watch size={72} strokeWidth={1} aria-hidden="true" /></div>}
                </div>
                <p className="mt-4 text-right text-[9px] font-medium uppercase tracking-[.18em] text-muted-foreground">Selected by Chronos</p>
            </div>
        </header>
    );
}
