import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, RefreshCw, SearchX, ShieldCheck } from 'lucide-react';
import NoticeCard from '../../components/client/NoticeCard';
import BrandCard from '../../components/client/brands/BrandCard';
import BrandHero from '../../components/client/brands/BrandHero';
import BrandToolbar from '../../components/client/brands/BrandToolbar';
import { Button } from '../../components/ui/button';
import { buttonVariants } from '../../components/ui/button-variants';
import { useBrandCatalog } from '../../hooks/useBrandCatalog';
import { countriesOf, filterBrands } from '../../utils/brandCatalog';
import '../../styles/storefront-pages.css';
import '../../styles/brand-catalog.css';

const CardSkeleton = () => <div className="h-80 animate-pulse rounded-xl border border-border bg-card p-4"><div className="h-36 rounded-lg bg-muted" /><div className="mt-5 h-5 w-1/2 rounded bg-muted" /><div className="mt-3 h-3 rounded bg-muted" /></div>;

export default function BrandListPage() {
    const { brands, loading, failed, refresh } = useBrandCatalog();
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('all');
    const countries = useMemo(() => countriesOf(brands), [brands]);
    const visible = useMemo(() => filterBrands(brands, { search, country }), [brands, search, country]);
    const clearFilters = () => { setSearch(''); setCountry('all'); };
    return (
        <main className="atelier-shell brand-catalog-page">
            <BrandHero brands={brands} loading={loading} />
            <section id="brand-directory" className="brand-directory" aria-labelledby="brand-directory-title">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div><p className="atelier-eyebrow">Khám phá & lựa chọn</p><h2 id="brand-directory-title" className="atelier-section-title mt-3">Tìm thương hiệu của bạn.</h2></div>
                    <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Một phong cách riêng, bắt đầu từ một cái tên.</p>
                </div>
                <BrandToolbar search={search} onSearch={setSearch} country={country} countries={countries} onCountry={setCountry} shown={visible.length} total={brands.length} />
                <div className="mt-6">
                    {loading && <div className="brand-catalog-grid">{[0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}</div>}
                    {!loading && failed && <NoticeCard icon={RefreshCw} tone="error" title="Không tải được danh sách thương hiệu" description="Máy chủ tạm ngừng phản hồi. Vui lòng thử lại."><Button size="sm" onClick={refresh}><RefreshCw size={14} />Tải lại</Button></NoticeCard>}
                    {!loading && !failed && visible.length === 0 && <NoticeCard icon={SearchX} title="Không tìm thấy thương hiệu phù hợp" description="Thử từ khóa khác hoặc bỏ bộ lọc quốc gia đang chọn."><Button size="sm" onClick={clearFilters}>Xóa bộ lọc</Button></NoticeCard>}
                    {!loading && !failed && visible.length > 0 && <div className="brand-catalog-grid">{visible.map((brand, index) => <BrandCard key={brand.id} brand={brand} index={index} />)}</div>}
                </div>
            </section>
            <section className="brand-catalog-footer">
                <div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"><ShieldCheck size={23} strokeWidth={1.5} /></span><div><h2 className="text-xl font-semibold tracking-tight">Chọn thương hiệu. Chọn sự an tâm.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Thông số rõ ràng, phiếu bảo hành điện tử và sự đồng hành từ Chronos trong từng lựa chọn.</p></div></div>
                <Link to="/about" className={buttonVariants({ variant: 'outline', className: 'shrink-0' })}>Câu chuyện Chronos <ArrowUpRight size={16} /></Link>
            </section>
        </main>
    );
}
