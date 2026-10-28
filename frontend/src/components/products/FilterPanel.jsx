import React from 'react';
import { Banknote, Check, Layers, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { facetOptions, buildPriceTiers, toggleValue } from '../../utils/productFilters';
import { SPEC_FILTER_GROUPS } from '../../constants/productFilters';
import FilterSection from './FilterSection';
import FilterOptionRow from './FilterOptionRow';
import PriceRangeForm from './PriceRangeForm';
import { cn } from '@/lib/utils';

/** Cây danh mục 2 cấp → hàng bấm (con thụt đầu dòng), kèm số sản phẩm có thật. */
const CategoryRows = ({ nodes, filters, applyFilters, depth = 0 }) =>
    nodes.map((node) => (
        <React.Fragment key={node.id ?? node._id}>
            <FilterOptionRow
                label={node.name}
                count={node.subtree_product_count ?? node.product_count}
                indent={depth}
                active={String(filters.categoryId) === String(node.id)}
                onClick={() => applyFilters({ categoryId: String(node.id), categoryLabel: node.name })}
            />
            {node.children?.length > 0 && depth < 1 && (
                <CategoryRows nodes={node.children} filters={filters} applyFilters={applyFilters} depth={depth + 1} />
            )}
        </React.Fragment>
    ));

/**
 * Bảng lọc dùng chung cho cột trái (desktop) và drawer (mobile).
 * Mọi lựa chọn đều đến từ dữ liệu thật: /products/facets trả giá trị thông số đang có
 * trong catalog + min/max giá, nên không thể phát sinh ô lọc luôn cho 0 kết quả.
 */
const FilterPanel = ({ filters, categories, brands, facets, applyFilters, clearFilters, className }) => {
    const tiers = buildPriceTiers(facets.price);
    const specGroups = (facets.specs || []).filter((g) => SPEC_FILTER_GROUPS.includes(g.key));
    const activeBrandCount = filters.brandIds.length;

    const toggleSpec = (key, value) => applyFilters({ specs: { ...filters.specs, [key]: toggleValue(filters.specs[key], value) } });

    return (
        <div className={className}>
            <div className="flex items-center justify-between px-4 pb-2 pt-4">
                <p className="text-[13px] font-bold uppercase tracking-[0.02em] text-navy-700">Bộ lọc</p>
                <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-muted-foreground underline-offset-2 transition-colors hover:text-sale hover:underline"
                >
                    Xóa hết
                </button>
            </div>

            <FilterSection title="Danh mục" icon={Layers} activeCount={filters.categoryId ? 1 : 0}>
                <FilterOptionRow
                    label="Tất cả danh mục"
                    active={!filters.categoryId}
                    onClick={() => applyFilters({ categoryId: '', categoryLabel: '' })}
                />
                <CategoryRows nodes={categories} filters={filters} applyFilters={applyFilters} />
            </FilterSection>

            <FilterSection title="Thương hiệu" icon={ShieldCheck} activeCount={activeBrandCount} defaultOpen={activeBrandCount > 0 || tiers.length === 0}>
                {brands.length === 0 ? (
                    <p className="px-2 py-1 text-xs text-muted-foreground">Chưa có thương hiệu nào.</p>
                ) : (
                    brands.map((brand) => (
                        <FilterOptionRow
                            key={brand.id ?? brand._id}
                            label={brand.name}
                            count={brand.product_count}
                            checkable
                            indent={1}
                            active={filters.brandIds.includes(String(brand.id))}
                            onClick={() => applyFilters({ brandIds: toggleValue(filters.brandIds, String(brand.id)) })}
                        />
                    ))
                )}
            </FilterSection>

            <FilterSection title="Khoảng giá" icon={Banknote} activeCount={filters.minPrice || filters.maxPrice ? 1 : 0}>
                {tiers.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {tiers.map((tier, idx) => {
                            const active = filters.minPrice === tier.min && filters.maxPrice === tier.max;
                            return (
                                <button
                                    key={tier.label || idx}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => applyFilters({ minPrice: tier.min, maxPrice: tier.max })}
                                    className={cn(
                                        'flex h-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-[12px] font-semibold transition-colors',
                                        idx === 0 && 'col-span-2',
                                        active
                                            ? 'border-navy-600 bg-navy-50 text-navy-700 ring-1 ring-navy-600/20'
                                            : 'border-border bg-card text-foreground/80 hover:border-navy-300 hover:bg-navy-50/50 hover:text-navy-700'
                                    )}
                                >
                                    {active && <Check size={13} strokeWidth={2.5} aria-hidden="true" />}
                                    <span className="truncate">{tier.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                <PriceRangeForm
                    key={`${filters.minPrice}-${filters.maxPrice}`}
                    minPrice={filters.minPrice}
                    maxPrice={filters.maxPrice}
                    price={facets.price}
                    onApply={({ minPrice, maxPrice }) => applyFilters({ minPrice, maxPrice })}
                />
            </FilterSection>

            {specGroups.map((group) => (
                <FilterSection
                    key={group.key}
                    title={group.label}
                    icon={SlidersHorizontal}
                    activeCount={(filters.specs[group.key] || []).length}
                    defaultOpen={(filters.specs[group.key] || []).length > 0}
                >
                    {facetOptions(group).map((option) => (
                        <FilterOptionRow
                            key={option.value}
                            label={option.value}
                            count={option.count}
                            checkable
                            indent={1}
                            active={(filters.specs[group.key] || []).includes(option.value)}
                            onClick={() => toggleSpec(group.key, option.value)}
                        />
                    ))}
                </FilterSection>
            ))}
        </div>
    );
};

export default FilterPanel;
