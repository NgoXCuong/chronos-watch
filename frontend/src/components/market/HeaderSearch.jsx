import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchSuggest from './SearchSuggest';
import { useSearchSuggest } from '../../hooks/useSearchSuggest';

/**
 * Ô tìm kiếm của header: gõ ≥2 ký tự thì gọi `/products?search=` lấy 6 kết quả và mở listbox
 * ngay dưới input. Enter không chọn dòng nào (hoặc bấm nút Tìm kiếm) vẫn về `/products?search=`
 * như hành vi cũ — gợi ý chỉ là đường tắt, không thay kết quả tìm kiếm.
 */
const HeaderSearch = () => {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const boxRef = useRef(null);
    const navigate = useNavigate();
    const { term, ready, items, loading } = useSearchSuggest(query);

    useEffect(() => {
        const onPointerDown = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, []);

    const go = (path) => {
        setOpen(false);
        setActive(-1);
        navigate(path);
    };
    const viewAll = () => go(term ? `/products?search=${encodeURIComponent(term)}` : '/products');
    const selectProduct = (product) => go(`/products/${product.slug || product.id}`);

    const onKeyDown = (event) => {
        const { key } = event;
        if (key === 'Escape') {
            setOpen(false);
            setActive(-1);
            return;
        }
        if (key === 'Tab') {
            setOpen(false);
            return;
        }
        if (key === 'Enter') {
            if (open && active >= 0) {
                event.preventDefault();
                if (active < items.length) selectProduct(items[active]);
                else viewAll();
            }
            return;
        }
        if (key !== 'ArrowDown' && key !== 'ArrowUp') return;
        if (!ready || loading || items.length === 0) return;

        event.preventDefault();
        setOpen(true);
        const last = items.length;
        const step = key === 'ArrowDown' ? 1 : -1;
        setActive((prev) => {
            const from = prev < 0 ? (step > 0 ? -1 : 0) : prev;
            return Math.min(Math.max(from + step, 0), last);
        });
    };

    return (
        <form
            ref={boxRef}
            onSubmit={(event) => {
                event.preventDefault();
                viewAll();
            }}
            className="relative hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex"
        >
            <div className="relative w-full max-w-xl min-w-0">
                <Input
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setActive(-1);
                        setOpen(true);
                    }}
                    onFocus={() => ready && setOpen(true)}
                    onKeyDown={onKeyDown}
                    placeholder="Bạn cần tìm đồng hồ nào hôm nay?"
                    aria-label="Tìm kiếm sản phẩm"
                    role="combobox"
                    aria-expanded={open && ready}
                    aria-controls="header-search-suggest"
                    aria-activedescendant={active >= 0 ? `search-suggest-${active}` : undefined}
                    autoComplete="off"
                    className="h-11 border-navy-600! border-2 focus-visible:shadow-[0_0_0_3px_rgba(15,42,74,0.12)]"
                />
                <SearchSuggest
                    open={open && ready}
                    term={term}
                    items={items}
                    loading={loading}
                    active={active}
                    onHover={setActive}
                    onSelect={selectProduct}
                    onViewAll={viewAll}
                />
            </div>
            <Button type="submit" size="lg" aria-label="Tìm kiếm" className="h-11 shrink-0 rounded-lg! px-3 xl:px-6">
                <Search size={16} strokeWidth={2} aria-hidden="true" />
                <span className="hidden xl:inline">Tìm kiếm</span>
            </Button>
        </form>
    );
};

export default HeaderSearch;
