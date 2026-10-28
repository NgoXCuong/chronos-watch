import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, SearchX, Store } from 'lucide-react';

import NoticeCard from '../../components/client/NoticeCard';
import BrandCard from '../../components/client/brands/BrandCard';
import BrandToolbar from '../../components/client/brands/BrandToolbar';
import TrustBar from '../../components/market/TrustBar';
import { Button, buttonVariants } from '../../components/ui/button';
import { useBrandCatalog } from '../../hooks/useBrandCatalog';
import { countriesOf, filterBrands, totalProductsOf } from '../../utils/brandCatalog';

const Stat = ({ value, label }) => (
    <div className="text-right">
        <dd className="text-2xl font-bold tabular-nums text-white">{value}</dd>
        <dt className="text-[12px] uppercase tracking-[0.02em] text-navy-200">{label}</dt>
    </div>
);

const CardSkeleton = () => (
    <div className="h-56 animate-pulse rounded-xl border border-border bg-card p-4">
        <div className="h-24 rounded-lg bg-navy-50" />
        <div className="mt-3 h-4 w-1/2 rounded bg-navy-50" />
        <div className="mt-2 h-3 w-full rounded bg-navy-50" />
        <div className="mt-1.5 h-3 w-4/5 rounded bg-navy-50" />
    </div>
);

/** Trang danh sách thương hiệu: lưới card + lọc quốc gia tại chỗ, số liệu lấy thẳng `/brands`. */
const BrandListPage = () => {
    const { brands, loading, failed, refresh } = useBrandCatalog();
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('all');

    const countries = useMemo(() => countriesOf(brands), [brands]);
    const visible = useMemo(() => filterBrands(brands, { search, country }), [brands, search, country]);
    const clearFilters = () => {
        setSearch('');
        setCountry('all');
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-navy-600 text-white">
                <div className="mx-auto flex w-full flex-wrap items-end justify-between gap-x-8 gap-y-5 px-12 py-7 md:px-16 lg:px-24">
                    <div className="min-w-0">
                        <p className="mb-1.5 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.02em] text-navy-200">
                            <Link to="/" className="transition-colors hover:text-white">
                                Trang chủ
                            </Link>
                            <ChevronRight size={12} strokeWidth={2.5} aria-hidden="true" />
                            <span>Thương hiệu</span>
                        </p>
                        <h1 className="text-2xl font-bold leading-tight md:text-3xl">Thương hiệu Chronos phân phối</h1>
                        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-navy-100">
                            Mỗi hãng dưới đây được nhập khẩu chính ngạch kèm phiếu bảo hành điện tử kích hoạt theo đơn hàng. Bấm vào hãng để xem toàn bộ sản phẩm đang bán.
                        </p>
                    </div>

                    <dl className="flex items-end gap-8">
                        <Stat value={loading ? '—' : brands.length} label="Thương hiệu" />
                        <span className="h-10 w-px bg-navy-500" aria-hidden="true" />
                        <Stat value={loading ? '—' : countries.length} label="Quốc gia" />
                        <span className="h-10 w-px bg-navy-500" aria-hidden="true" />
                        <Stat value={loading ? '—' : totalProductsOf(brands)} label="Sản phẩm đang bán" />
                    </dl>
                </div>
            </header>

            <div className="mx-auto w-full space-y-6 px-12 py-8 md:px-16 lg:px-24">
                <BrandToolbar
                    search={search}
                    onSearch={setSearch}
                    country={country}
                    countries={countries}
                    onCountry={setCountry}
                    shown={visible.length}
                    total={brands.length}
                />

                {loading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[0, 1, 2, 3].map((i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {!loading && failed && (
                    <NoticeCard icon={RefreshCw} tone="error" title="Không tải được danh sách thương hiệu" description="Máy chủ tạm ngừng phản hồi. Thử lại sau ít phút.">
                        <Button variant="buy" size="sm" onClick={refresh}>
                            <RefreshCw size={14} strokeWidth={2} aria-hidden="true" />
                            Tải lại
                        </Button>
                    </NoticeCard>
                )}

                {!loading && !failed && visible.length === 0 && (
                    <NoticeCard icon={SearchX} title="Không tìm thấy thương hiệu phù hợp" description="Thử từ khóa khác hoặc bỏ bộ lọc quốc gia đang chọn.">
                        <Button variant="buy" size="sm" onClick={clearFilters}>
                            Xóa bộ lọc
                        </Button>
                    </NoticeCard>
                )}

                {!loading && !failed && visible.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visible.map((brand) => (
                            <BrandCard key={brand.id} brand={brand} />
                        ))}
                    </div>
                )}

                <section className="space-y-6 pt-2">
                    <TrustBar />

                    <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-navy-50/70 p-5 md:flex-row md:items-center">
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy-600 text-white">
                                <Store size={18} strokeWidth={2} aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-[15px] font-bold text-navy-800">Chronos làm việc với các hãng như thế nào?</p>
                                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                                    Nguồn hàng, kiểm định và chế độ hậu mãi được mô tả ở trang Về chúng tôi.
                                </p>
                            </div>
                        </div>
                        <Link to="/about" className={buttonVariants({ variant: 'buy', size: 'sm', className: 'shrink-0' })}>
                            Về Chronos
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BrandListPage;
