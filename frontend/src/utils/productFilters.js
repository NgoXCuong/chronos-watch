import { SPEC_FILTER_GROUPS, DEFAULT_SORT, PAGE_SIZE, MAX_SPEC_OPTIONS } from "../constants/productFilters.js";

/** Cây danh mục `/categories` → index tra theo slug lẫn id (link từ trang chủ đang dùng slug). */
export const indexCategories = (nodes = [], out = { list: [], bySlug: new Map(), byId: new Map() }) => {
    nodes.forEach((node) => {
        out.list.push(node);
        if (node.slug) out.bySlug.set(node.slug, node);
        out.byId.set(String(node.id), node);
        if (node.children?.length) indexCategories(node.children, out);
    });
    return out;
};

/** `?category=` chấp nhận slug hoặc id; trả về id thật cho API + nhãn để hiện chip. */
export const resolveCategory = (value, index) => {
    if (!value) return { id: "", label: "" };
    const hit = index.bySlug.get(value) || index.byId.get(String(value));
    return { id: hit ? String(hit.id) : String(value), label: hit?.name || value };
};

const csv = (value) =>
    String(value ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

/** URL → state bộ lọc (nguồn sự thật là searchParams để chia sẻ/refresh được). */
export const parseFilters = (searchParams, categoryIndex) => {
    const specs = {};
    SPEC_FILTER_GROUPS.forEach((key) => {
        const values = csv(searchParams.get(key));
        if (values.length) specs[key] = values;
    });
    const category = resolveCategory(searchParams.get("category"), categoryIndex);
    return {
        categoryId: category.id,
        categoryLabel: category.label,
        brandIds: csv(searchParams.get("brand")),
        sort: searchParams.get("sort") || DEFAULT_SORT,
        search: searchParams.get("search") || "",
        minPrice: searchParams.get("min_price") || "",
        maxPrice: searchParams.get("max_price") || "",
        page: Math.max(1, parseInt(searchParams.get("page"), 10) || 1),
        specs,
    };
};

/** State bộ lọc → query params gọi `/products`. */
export const buildQuery = (filters) => {
    const params = { limit: PAGE_SIZE, page: filters.page, sort: filters.sort };
    if (filters.categoryId) params.category_id = filters.categoryId;
    if (filters.brandIds.length) params.brand_id = filters.brandIds.join(",");
    if (filters.search) params.search = filters.search;
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;
    Object.entries(filters.specs).forEach(([key, values]) => {
        if (values.length) params[key] = values.join(",");
    });
    return params;
};

/** Bậc giá chia theo khoảng giá THẬT của catalog (không hardcode mức vượt xa dữ liệu). */
export const PRICE_TIERS = 4;

export const formatTier = (value) => {
    if (value >= 1e6) {
        const triệu = Math.round(value / 1e5) / 10;
        return `${triệu.toString().replace(".", ",")} tr`;
    }
    return `${Math.max(1, Math.round(value / 1e3))} k`;
};

const niceStep = (span) => {
    const rough = span / PRICE_TIERS;
    const magnitude = 10 ** Math.floor(Math.log10(rough || 1));
    return Math.max(magnitude, Math.round(rough / magnitude) * magnitude);
};

/**
 * Bậc giá chia theo khoảng giá THẬT của catalog: min/max lấy từ `/products/facets`.
 * Bản cũ hardcode "50 – 200 triệu" trong khi hàng đắt nhất chỉ 27 triệu, nghĩa là hai
 * ô lọc đầu tiên luôn trả 0 kết quả. Mốc làm tròn về bội số đẹp nên nhãn đọc được.
 */
export const buildPriceTiers = ({ min = 0, max = 0 } = {}) => {
    if (!(max > min)) return [];
    const step = niceStep(max - min);
    const base = Math.floor(min / step) * step;
    const tiers = [{ label: "Tất cả mức giá", min: "", max: "" }];
    for (let i = 0; i < PRICE_TIERS; i += 1) {
        const lo = base + step * i;
        const hi = base + step * (i + 1);
        if (lo >= max) break;
        const last = hi >= max;
        tiers.push({
            label: last ? `Trên ${formatTier(lo)}` : i === 0 ? `Dưới ${formatTier(hi)}` : `${formatTier(lo)} – ${formatTier(hi)}`,
            min: lo ? String(lo) : "",
            max: last ? "" : String(hi),
        });
    }
    return tiers.length > 1 ? tiers : [];
};

/** Giới hạn số lựa chọn mỗi nhóm thông số (nhóm "Kích thước mặt" có 13 giá trị khác nhau). */
export const facetOptions = (facet) => (facet.options || []).slice(0, MAX_SPEC_OPTIONS);

export const toggleValue = (list = [], value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

/** Gộp state bộ lọc hiện tại vào URL (mọi thay đổi lọc đều về trang 1). */
export const filtersToParams = (filters) => {
    const params = new URLSearchParams();
    if (filters.categoryId) params.set("category", filters.categoryId);
    if (filters.brandIds.length) params.set("brand", filters.brandIds.join(","));
    if (filters.search) params.set("search", filters.search);
    if (filters.sort && filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
    if (filters.minPrice) params.set("min_price", filters.minPrice);
    if (filters.maxPrice) params.set("max_price", filters.maxPrice);
    Object.entries(filters.specs).forEach(([key, values]) => {
        if (values.length) params.set(key, values.join(","));
    });
    if (filters.page > 1) params.set("page", String(filters.page));
    return params;
};

/** Đếm số ô lọc đang bật (cho nút "Bộ lọc" trên mobile). */
export const countActiveFilters = (filters) =>
    (filters.categoryId ? 1 : 0) +
    filters.brandIds.length +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    Object.values(filters.specs).reduce((sum, values) => sum + values.length, 0);
