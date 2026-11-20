import CategoryFilterChoices from './CategoryFilterChoices';
import FilterChoices from './FilterChoices';

import { Banknote, Check, Layers, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { facetOptions, buildPriceTiers, toggleValue } from '../../utils/productFilters';
import { SPEC_FILTER_GROUPS } from '../../constants/productFilters';
import FilterSection from './FilterSection';
import FilterOptionRow from './FilterOptionRow';
import PriceRangeForm from './PriceRangeForm';
import { cn } from '@/lib/utils';

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
        <div className={cn("catalog-filter-panel", className)}>
            <div className="flex items-center justify-between px-4 pb-2 pt-4">
                <div><p className="text-[13px] font-bold text-foreground inline-flex items-center gap-2"><SlidersHorizontal size={16} />Tinh chỉnh lựa chọn</p><p className="mt-1 text-[11px] text-muted-foreground">Chọn theo nhu cầu của bạn</p></div>
                <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-muted-foreground underline-offset-2 transition-colors hover:text-sale hover:underline"
                >
                    Xóa hết
                </button>
            </div>

            <FilterSection title="Danh mục" icon={Layers} summary={filters.categoryLabel || 'Chọn theo dòng đồng hồ'} activeCount={filters.categoryId ? 1 : 0}>
                <CategoryFilterChoices categories={categories} filters={filters} applyFilters={applyFilters} />
            </FilterSection>

            <FilterSection title="Thương hiệu" icon={ShieldCheck} activeCount={activeBrandCount} summary={activeBrandCount ? brands.filter((b) => filters.brandIds.includes(String(b.id))).map((b) => b.name).join(', ') : `${brands.length} thương hiệu trong bộ sưu tập`}>
                {brands.length === 0 ? (
                    <p className="px-2 py-1 text-xs text-muted-foreground">Chưa có thương hiệu nào.</p>
                ) : (
                    <FilterChoices>{[...brands.filter((b) => filters.brandIds.includes(String(b.id))), ...brands.filter((b) => !filters.brandIds.includes(String(b.id)))].map((brand) => (
                        <FilterOptionRow
                            key={brand.id ?? brand._id}
                            label={brand.name}
                            count={brand.product_count}
                            checkable
                            indent={1}
                            active={filters.brandIds.includes(String(brand.id))}
                            onClick={() => applyFilters({ brandIds: toggleValue(filters.brandIds, String(brand.id)) })}
                        />
                    ))}</FilterChoices>
                )}
            </FilterSection>

            <FilterSection title="Khoảng giá" icon={Banknote} defaultOpen activeCount={filters.minPrice || filters.maxPrice ? 1 : 0}>
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
                    summary={(filters.specs[group.key] || []).join(', ') || `${facetOptions(group).length} lựa chọn`}
                >
                    <FilterChoices>{facetOptions(group).map((option) => (
                        <FilterOptionRow
                            key={option.value}
                            label={option.value}
                            count={option.count}
                            checkable
                            indent={1}
                            active={(filters.specs[group.key] || []).includes(option.value)}
                            onClick={() => toggleSpec(group.key, option.value)}
                        />
                    ))}</FilterChoices>
                </FilterSection>
            ))}
        </div>
    );
};

export default FilterPanel;
