/** Chuẩn hoá payload `/brands` (admin trả `{count, rows}`, nơi khác trả mảng trần). */
export const toRows = (data) => data?.rows || (Array.isArray(data) ? data : data?.data || []);

/** Bộ lọc công khai không trả thương hiệu ẩn, nhưng phòng khi API đổi thì vẫn loại ở UI. */
export const isShownBrand = (brand) => brand?.is_active !== false;

export const brandHref = (brand) => `/products?brand=${brand.id}`;

export const brandProductCount = (brand) => Number(brand.product_count) || 0;

/** Mô tả do admin tải lên; không có thì nói thẳng, không đắp câu quảng cáo vào. */
export const brandDescription = (brand) =>
    brand.description?.trim() || 'Chronos chưa tải mô tả cho thương hiệu này — thông tin chi tiết nằm ở trang sản phẩm.';

/** Danh sách quốc gia xuất hiện thật trong dữ liệu, sắp xếp theo tiếng Việt. */
export const countriesOf = (brands) =>
    [...new Set(brands.map((brand) => String(brand.country || '').trim()).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, 'vi'),
    );

export const totalProductsOf = (brands) => brands.reduce((sum, brand) => sum + brandProductCount(brand), 0);

/** Lọc theo từ khóa + quốc gia ngay trên danh sách đã tải một lần (toàn bộ hãng chỉ vài chục bản ghi). */
export const filterBrands = (brands, { search = '', country = 'all' } = {}) => {
    const keyword = search.trim().toLowerCase();
    return brands.filter((brand) => {
        if (country !== 'all' && String(brand.country || '').trim() !== country) return false;
        if (!keyword) return true;
        return `${brand.name} ${brand.country || ''}`.toLowerCase().includes(keyword);
    });
};
