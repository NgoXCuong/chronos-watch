import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import productApi from '../api/product.api';
import categoryApi from '../api/category.api';
import brandApi from '../api/brand.api';
import { PAGE_SIZE } from '../constants/productFilters';
import { buildQuery, filtersToParams, indexCategories, parseFilters } from '../utils/productFilters';

const list = (payload) => (Array.isArray(payload) ? payload : payload?.rows || payload?.data || []);

/**
 * Nguồn sự thật của trang `/products` là URL: người dùng có thể copy link đã lọc,
 * bấm Back hay reload mà không mất trạng thái. Hook giữ state fetch + tùy chọn lọc.
 */
export function useProductCatalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [facets, setFacets] = useState({ total: 0, specs: [], price: { min: 0, max: 0 } });
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const categoryIndex = useMemo(() => indexCategories(categories), [categories]);
    const filters = useMemo(() => parseFilters(searchParams, categoryIndex), [searchParams, categoryIndex]);
    const query = useMemo(() => buildQuery(filters), [filters]);
    // searchParams là object mới ở mỗi render → khóa request theo nội dung query thật
    const queryKey = JSON.stringify(query);

    useEffect(() => {
        let alive = true;
        Promise.all([
            categoryApi.getAll().catch(() => []),
            brandApi.getAll().catch(() => []),
            productApi.getFacets().catch(() => null),
        ])
            .then(([catRes, brandRes, facetRes]) => {
                if (!alive) return;
                // /categories đã lọc is_active + kèm product_count ở backend
                setCategories(list(catRes));
                setBrands(list(brandRes).filter((b) => b.is_active !== false && b.isActive !== false));
                if (facetRes) setFacets(facetRes);
            });
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        productApi
            .getAll(query)
            .then((data) => {
                if (!alive) return;
                const rows = list(data);
                setProducts(rows);
                setTotalCount(data?.count ?? rows.length);
            })
            .catch(() => {
                if (!alive) return;
                setProducts([]);
                setTotalCount(0);
            })
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryKey]);

    /** Cập nhật bộ lọc → ghi lại URL (đổi lọc luôn về trang 1, đổi trang thì giữ lọc). */
    const applyFilters = useCallback(
        (patch) => {
            const next = { ...filters, ...patch };
            if (!('page' in patch)) next.page = 1;
            setSearchParams(filtersToParams(next), { replace: true });
        },
        [filters, setSearchParams]
    );

    const clearFilters = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

    return {
        filters,
        categories,
        brands,
        facets,
        products,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
        loading,
        applyFilters,
        clearFilters,
    };
}
