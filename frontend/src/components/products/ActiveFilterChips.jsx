import React from 'react';
import { X } from 'lucide-react';
import { formatTier, toggleValue } from '../../utils/productFilters';

/** Nhãn hiển thị cho từng ô lọc đang bật; onRemove là hành động bỏ đúng ô đó. */
const buildChips = (filters, brands, specLabels) => {
    const chips = [];
    if (filters.search) {
        chips.push({ key: 'search', label: `“${filters.search}”`, onRemove: () => ({ search: '' }) });
    }
    if (filters.categoryId) {
        chips.push({ key: 'category', label: filters.categoryLabel || 'Danh mục', onRemove: () => ({ categoryId: '', categoryLabel: '' }) });
    }
    filters.brandIds.forEach((id) => {
        const brand = brands.find((b) => String(b.id ?? b._id) === id);
        chips.push({
            key: `brand-${id}`,
            label: brand?.name || `Hãng #${id}`,
            onRemove: () => ({ brandIds: toggleValue(filters.brandIds, id) }),
        });
    });
    if (filters.minPrice || filters.maxPrice) {
        const from = filters.minPrice ? formatTier(filters.minPrice) : '';
        const to = filters.maxPrice ? formatTier(filters.maxPrice) : '';
        chips.push({
            key: 'price',
            label: from && to ? `${from} – ${to}` : from ? `Từ ${from}` : `Dưới ${to}`,
            onRemove: () => ({ minPrice: '', maxPrice: '' }),
        });
    }
    Object.entries(filters.specs).forEach(([group, values]) =>
        values.forEach((value) =>
            chips.push({
                key: `${group}-${value}`,
                label: `${specLabels[group] ? `${specLabels[group]}: ` : ''}${value}`,
                onRemove: () => ({ specs: { ...filters.specs, [group]: toggleValue(values, value) } }),
            })
        )
    );
    return chips;
};

/** Dải chip "đang lọc" — mỗi chip bỏ đúng một điều kiện, không phải xóa cả bảng lọc. */
const ActiveFilterChips = ({ filters, brands, specLabels, applyFilters, onClear }) => {
    const chips = buildChips(filters, brands, specLabels);
    if (chips.length === 0) return null;

    return (
        <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.02em] text-muted-foreground">Đang lọc</span>
            {chips.map((chip) => (
                <button
                    key={chip.key}
                    type="button"
                    onClick={() => applyFilters(chip.onRemove())}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-navy-50 py-1 pl-2.5 pr-1.5 text-[13px] font-medium text-navy-700 transition-colors hover:border-navy-600 hover:bg-navy-600 hover:text-white"
                >
                    {chip.label}
                    <X size={13} strokeWidth={2.5} aria-hidden="true" />
                </button>
            ))}
            {chips.length > 1 && (
                <button
                    type="button"
                    onClick={onClear}
                    className="ml-1 text-[13px] font-semibold text-muted-foreground underline-offset-2 transition-colors hover:text-sale hover:underline"
                >
                    Xóa hết
                </button>
            )}
        </div>
    );
};

export default ActiveFilterChips;
