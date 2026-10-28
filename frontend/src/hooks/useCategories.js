import { useEffect, useState } from 'react';
import categoryApi from '../api/category.api';

/** Tải danh mục 1 lần cho CategorySidebar + CategoryCircleRow (HomePage truyền xuống, tránh double fetch). */
export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        categoryApi
            .getAll()
            .then((res) => {
                if (!alive) return;
                const items = Array.isArray(res) ? res : res?.data || [];
                setCategories(items.filter((c) => c.isActive !== false));
            })
            .catch(() => alive && setCategories([]))
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
    }, []);

    return { categories, loading };
}
