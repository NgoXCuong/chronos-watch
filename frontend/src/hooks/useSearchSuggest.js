import { useEffect, useState } from 'react';
import productApi from '../api/product.api';
import useDebounce from './useDebounce';

const MIN_CHARS = 2;
const toRows = (data) =>
    data?.rows || (Array.isArray(data) ? data : data?.products || data?.data || []);

/**
 * Gợi ý sản phẩm theo từ khóa, dùng thẳng `GET /products?search=` (khớp `name` + `sku`).
 * Kết quả lưu kèm chính từ khóa đã tìm (`snapshot.term`) nên kết quả cũ tự biến mất khi
 * người dùng gõ tiếp — không cần request key, và không có `setState` đồng bộ trong effect.
 */
export const useSearchSuggest = (rawQuery, { limit = 6, delay = 300 } = {}) => {
    const term = rawQuery.trim();
    const debounced = useDebounce(term, delay);
    const [snapshot, setSnapshot] = useState({ term: '', items: [] });

    useEffect(() => {
        if (debounced.length < MIN_CHARS) return;
        let alive = true;
        productApi
            .getAll({ search: debounced, limit })
            .then((data) => {
                if (alive) setSnapshot({ term: debounced, items: toRows(data).slice(0, limit) });
            })
            .catch(() => {
                if (alive) setSnapshot({ term: debounced, items: [] });
            });
        return () => {
            alive = false;
        };
    }, [debounced, limit]);

    const ready = term.length >= MIN_CHARS;

    return {
        term,
        ready,
        loading: ready && snapshot.term !== term,
        items: snapshot.term === term ? snapshot.items : [],
    };
};

export default useSearchSuggest;
