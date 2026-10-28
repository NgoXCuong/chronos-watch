import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatCurrency } from '../../utils/formatCurrency';
import anhminhhoa from '../../assets/anh-minh-hoa.jpg';

const RowSkeleton = () => (
    <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="size-10 shrink-0 rounded-lg bg-navy-50" />
        <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-3 w-3/5 rounded bg-navy-50" />
            <div className="h-2.5 w-1/4 rounded bg-navy-50" />
        </div>
        <div className="h-3 w-14 rounded bg-navy-50" />
    </div>
);

/** Tô đúng đoạn khớp từ khóa — một lần xuất hiện đầu tiên, không dùng innerHTML. */
const highlight = (text, term) => {
    const value = String(text ?? '');
    const at = term ? value.toLowerCase().indexOf(term.toLowerCase()) : -1;
    if (at < 0) return value;
    return (
        <>
            {value.slice(0, at)}
            <b className="font-bold text-navy-800">{value.slice(at, at + term.length)}</b>
            {value.slice(at + term.length)}
        </>
    );
};

/**
 * Panel gợi ý của ô tìm kiếm header: sản phẩm khớp `name`/`sku` + dòng "Xem tất cả".
 * Là `<ul role="listbox">` thuần trình bày — state bàn phím nằm ở HeaderSearch.
 */
const SearchSuggest = ({ open, term, items, loading, active, onHover, onSelect, onViewAll }) => {
    if (!open) return null;
    const viewAllIndex = items.length;

    return (
        <ul
            id="header-search-suggest"
            role="listbox"
            className="absolute inset-x-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-hover"
        >
            {loading && (
                <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                </>
            )}

            {!loading && items.length === 0 && (
                <li className="flex items-center gap-2 px-3 py-6 text-[13px] text-muted-foreground">
                    <Search size={15} strokeWidth={2} aria-hidden="true" />
                    Không tìm thấy sản phẩm khớp với “{term}”
                </li>
            )}

            {!loading &&
                items.map((product, index) => (
                    <li key={product.id ?? product.slug} role="option" aria-selected={active === index} id={`search-suggest-${index}`}>
                        <button
                            type="button"
                            onMouseEnter={() => onHover(index)}
                            onClick={() => onSelect(product)}
                            className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
                                active === index ? 'bg-navy-50' : 'hover:bg-accent',
                            )}
                        >
                            <img
                                src={product.image_url || anhminhhoa}
                                alt=""
                                aria-hidden="true"
                                className="size-10 shrink-0 rounded-lg bg-navy-50 object-contain"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13px] font-medium text-foreground">
                                    {highlight(product.name, term)}
                                </span>
                                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                                    {product.brand?.name || 'Chronos'}
                                    {product.sku ? ` · ${highlight(product.sku, term)}` : ''}
                                </span>
                            </span>
                            <span className="shrink-0 text-[13px] font-bold tabular-nums text-navy-700">
                                {formatCurrency(product.price)}
                            </span>
                        </button>
                    </li>
                ))}

            {!loading && viewAllIndex > 0 && (
                <li role="option" aria-selected={active === viewAllIndex} id={`search-suggest-${viewAllIndex}`}>
                    <button
                        type="button"
                        onMouseEnter={() => onHover(viewAllIndex)}
                        onClick={onViewAll}
                        className={cn(
                            'flex w-full items-center justify-between gap-2 border-t border-border px-2.5 py-2.5 text-[12px] font-semibold text-navy-700 transition-colors',
                            active === viewAllIndex ? 'bg-navy-50' : 'hover:bg-accent',
                        )}
                    >
                        <span className="truncate">Xem tất cả kết quả cho “{term}”</span>
                        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                    </button>
                </li>
            )}
        </ul>
    );
};

export default SearchSuggest;
