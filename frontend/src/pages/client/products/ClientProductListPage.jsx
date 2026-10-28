import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProductCatalog } from '../../../hooks/useProductCatalog';
import { countActiveFilters } from '../../../utils/productFilters';
import ProductToolbar from '../../../components/products/ProductToolbar';
import FilterPanel from '../../../components/products/FilterPanel';
import FilterDrawer from '../../../components/products/FilterDrawer';
import ActiveFilterChips from '../../../components/products/ActiveFilterChips';
import ProductGrid from '../../../components/products/ProductGrid';
import AdminPagination from '../../../components/admin/Common/AdminPagination';

/**
 * Trang danh sách sản phẩm: URL là nguồn sự thật của bộ lọc (chia sẻ được link đã lọc),
 * cột trái là bảng lọc dữ liệu thật, mobile cùng bảng đó trong drawer.
 */
const ClientProductListPage = () => {
    const { filters, categories, brands, facets, products, totalCount, totalPages, loading, applyFilters, clearFilters } = useProductCatalog();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const specLabels = useMemo(() => Object.fromEntries((facets.specs || []).map((group) => [group.key, group.label])), [facets.specs]);
    const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);
    const title = filters.categoryLabel || (filters.search ? `Kết quả cho “${filters.search}”` : 'Tất cả sản phẩm');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters.page]);

    const panel = (
        <FilterPanel
            filters={filters}
            categories={categories}
            brands={brands}
            facets={facets}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
        />
    );

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-navy-600 text-white">
                <div className="mx-auto flex w-full flex-wrap items-end justify-between gap-3 px-12 py-7 md:px-16 lg:px-24">
                    <div>
                        <p className="mb-1.5 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.02em] text-navy-200">
                            <Link to="/" className="transition-colors hover:text-white">
                                Trang chủ
                            </Link>
                            <ChevronRight size={12} strokeWidth={2.5} aria-hidden="true" />
                            <span>Sản phẩm</span>
                        </p>
                        <h1 className="text-2xl font-bold leading-tight md:text-3xl">{title}</h1>
                    </div>
                    <p className="text-[13px] font-medium text-navy-200">
                        <span className="text-base font-bold tabular-nums text-white">{totalCount}</span> sản phẩm đang bán
                    </p>
                </div>
            </header>

            <div className="mx-auto w-full px-12 py-8 md:px-16 lg:px-24">
                <div className="grid items-start gap-6 lg:grid-cols-[268px_minmax(0,1fr)]">
                    <aside className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-card lg:block">
                        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">{panel}</div>
                    </aside>

                    <main className="min-w-0">
                        <ProductToolbar
                            page={filters.page}
                            totalCount={totalCount}
                            activeFilterCount={activeFilterCount}
                            sort={filters.sort}
                            onSortChange={(sort) => applyFilters({ sort })}
                            onOpenFilters={() => setDrawerOpen(true)}
                        />

                        <ActiveFilterChips filters={filters} brands={brands} specLabels={specLabels} applyFilters={applyFilters} onClear={clearFilters} />

                        <ProductGrid products={products} loading={loading} onClearFilters={clearFilters} />

                        {totalPages > 1 && (
                            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
                                <AdminPagination
                                    currentPage={filters.page}
                                    totalPages={totalPages}
                                    totalCount={totalCount}
                                    countLabel="sản phẩm"
                                    onPageChange={(page) => applyFilters({ page })}
                                />
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} resultCount={totalCount}>
                {panel}
            </FilterDrawer>
        </div>
    );
};

export default ClientProductListPage;
