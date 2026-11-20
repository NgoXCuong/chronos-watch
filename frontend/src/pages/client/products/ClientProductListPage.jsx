import "../../../styles/product-catalog.css";
import "../../../styles/catalog-filters.css";
import CatalogIntro from "../../../components/products/CatalogIntro";
import HomeSupport from "../../../components/home/HomeSupport";
import React, { useEffect, useMemo, useState } from 'react';
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
        <div className="product-catalog min-h-screen bg-card text-foreground">
            <div className="catalog-shell">
                <CatalogIntro title={title} totalCount={totalCount} loading={loading} categories={categories} categoryId={filters.categoryId} onCategoryChange={applyFilters} />
                <div className="catalog-layout">
                    <aside className="catalog-sidebar hidden lg:block">
                        <div className="catalog-filter-scroll">{panel}</div>
                    </aside>

                    <section aria-label="Danh sách sản phẩm" className="min-w-0">
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
                            <div className="catalog-pagination mt-6 overflow-hidden rounded-xl border border-border bg-card">
                                <AdminPagination
                                    currentPage={filters.page}
                                    totalPages={totalPages}
                                    totalCount={totalCount}
                                    countLabel="sản phẩm"
                                    onPageChange={(page) => applyFilters({ page })}
                                />
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} resultCount={totalCount}>
                {panel}
            </FilterDrawer>
            <HomeSupport />
        </div>
    );
};

export default ClientProductListPage;
