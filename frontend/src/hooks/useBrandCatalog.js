import { useCallback, useEffect, useState } from 'react';
import brandApi from '../api/brand.api';
import { isShownBrand, toRows } from '../utils/brandCatalog';

// Toàn bộ thương hiệu đang bán chỉ vài chục bản ghi → tải một lần, lọc tại chỗ.
const LIMIT = 100;

/**
 * Danh sách thương hiệu công khai kèm `product_count` thật do backend tính.
 * Một nguồn cho cả trang /brands và dải số liệu ở trang /about.
 */
export const useBrandCatalog = () => {
    const [brands, setBrands] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    const load = useCallback(() => {
        let alive = true;
        brandApi
            .getAll({ limit: LIMIT })
            .then((data) => alive && setBrands(toRows(data).filter(isShownBrand)))
            .catch((error) => {
                console.error('Lỗi lấy danh sách thương hiệu:', error);
                if (alive) {
                    setBrands([]);
                    setFailed(true);
                }
            })
            .finally(() => alive && setLoaded(true));
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => load(), [load]);

    return { brands, loading: !loaded, failed, refresh: load };
};

export default useBrandCatalog;
