import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../ui/input';
import { cn } from '../../../lib/utils';

const Chip = ({ active, children, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
            'rounded-lg border px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.02em] whitespace-nowrap transition-colors',
            active
                ? 'border-navy-600 bg-navy-600 text-white'
                : 'border-border bg-card text-muted-foreground hover:border-navy-300 hover:text-navy-700',
        )}
    >
        {children}
    </button>
);

/** Ô tìm kiếm + chip quốc gia (danh sách hãng nhỏ nên lọc tại chỗ, không cần gọi lại API). */
const BrandToolbar = ({ search, onSearch, country, countries, onCountry, shown, total }) => (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="w-full md:max-w-sm">
                <Input
                    icon={Search}
                    value={search}
                    onChange={(event) => onSearch(event.target.value)}
                    placeholder="Tìm theo tên hãng hoặc quốc gia..."
                    aria-label="Tìm thương hiệu"
                />
            </div>
            <p className="text-[12px] tabular-nums text-muted-foreground md:ml-auto">
                Đang hiển thị <span className="font-bold text-navy-700">{shown}</span> / {total} thương hiệu
            </p>
        </div>

        {countries.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                <Chip active={country === 'all'} onClick={() => onCountry('all')}>
                    Tất cả
                </Chip>
                {countries.map((item) => (
                    <Chip key={item} active={country === item} onClick={() => onCountry(item)}>
                        {item}
                    </Chip>
                ))}
            </div>
        )}
    </div>
);

export default BrandToolbar;
