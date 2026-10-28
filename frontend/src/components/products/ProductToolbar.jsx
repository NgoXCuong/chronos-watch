import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';
import FilterSelect from '../admin/Common/FilterSelect';
import { PAGE_SIZE, SORT_OPTIONS } from '../../constants/productFilters';

const rangeLabel = ({ page, totalCount }) => {
    const from = (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, totalCount);
    return `Hiển thị ${from}–${to}`;
};

/**
 * Thanh công cụ trên danh sách: số kết quả + sắp xếp server-side (backend whitelist cột
 * sort), nút Bộ lọc cho mobile. Không có toggle lưới/danh sách vì trang chỉ có một kiểu lưới.
 */
const ProductToolbar = ({ page, totalCount, activeFilterCount, sort, onSortChange, onOpenFilters }) => (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onOpenFilters} className="h-9 gap-1.5 rounded-lg border-border px-3 text-[13px] font-semibold text-navy-700 lg:hidden">
                <Filter size={14} strokeWidth={2} aria-hidden="true" />
                Bộ lọc
                {activeFilterCount > 0 && <span className="rounded-md bg-navy-600 px-1.5 text-[11px] font-extrabold tabular-nums text-white">{activeFilterCount}</span>}
            </Button>
            <p className="text-[13px] font-medium text-muted-foreground">
                <span className="text-foreground tabular-nums">{totalCount}</span> sản phẩm
                {totalCount > PAGE_SIZE && <span className="hidden sm:inline"> · {rangeLabel({ page, totalCount })}</span>}
            </p>
        </div>

        <FilterSelect
            label="Sắp xếp"
            value={sort}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            contentClassName="w-56"
            className="h-9 gap-2 text-[13px]"
        />
    </div>
);

export default ProductToolbar;
