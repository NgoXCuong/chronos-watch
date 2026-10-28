import { Op, fn, col, literal, where } from "sequelize";

/**
 * products.specifications là JSON do admin tự gõ nên key đang tồn tại ở CẢ HAI thứ
 * tiếng Anh ('movement') và tiếng Việt ('Loại máy'). Bộ lọc phải tra qua alias map:
 * chỉ key nằm trong danh sách cứng dưới đây được nội suy vào JSON path, còn giá trị
 * luôn bind qua Op.eq/Op.in nên không có đường tiêm SQL.
 */
export const SPEC_FILTER_KEYS = [
    { key: "movement", label: "Loại máy", aliases: ["movement", "Loại máy", "Bộ máy"] },
    { key: "glass", label: "Kính", aliases: ["glass", "Chất liệu kính", "Kính"] },
    { key: "water_resistance", label: "Chống nước", aliases: ["water_resistance", "Chống nước"] },
    { key: "case_material", label: "Chất liệu vỏ", aliases: ["case_material", "Chất liệu vỏ"] },
    { key: "case_size", label: "Kích thước mặt", aliases: ["case_size", "Size mặt", "Kích thước mặt"] },
    { key: "strap_material", label: "Chất liệu dây", aliases: ["strap_material", "Chất liệu dây"] },
    { key: "dial_color", label: "Mặt số", aliases: ["dial_color", "Màu mặt số", "Loại mặt số"] },
    { key: "functions", label: "Chức năng", aliases: ["functions", "Tiện ích", "Chức năng"] },
];

const SPEC_BY_KEY = Object.fromEntries(SPEC_FILTER_KEYS.map((s) => [s.key, s]));

// JSON_EXTRACT trả về nguyên chuỗi có dấu nháy ("5atm") nên so sánh phải qua
// JSON_UNQUOTE; viết thẳng Op.eq trên sequelize.json() sẽ không bao giờ khớp.
const unquotePath = (alias) =>
    fn("JSON_UNQUOTE", fn("JSON_EXTRACT", col("specifications"), literal(`'$."${alias}"'`)));

const parseSpecs = (value) => {
    if (!value) return {};
    if (typeof value === "string") {
        try { return JSON.parse(value) || {}; } catch { return {}; }
    }
    return value;
};

/** `?movement=Automatic,Quartz` → OR giữa các alias VÀ OR giữa các giá trị. */
export const specFilterWhere = (key, rawValue) => {
    const spec = SPEC_BY_KEY[key];
    const values = String(rawValue ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .slice(0, 12);
    if (!spec || values.length === 0) return null;

    const eq = (alias, value) => where(unquotePath(alias), Op.eq, value);
    // Op.in trên một hàm JSON sinh SQL sai (`IN 'a', 'b'` thiếu ngoặc) nên nhiều giá trị
    // phải OR từng phép so sánh — giá trị vẫn bind theo cách an toàn của Sequelize.
    const perAlias = (alias) =>
        values.length === 1 ? eq(alias, values[0]) : { [Op.or]: values.map((v) => eq(alias, v)) };
    return { [Op.or]: spec.aliases.map(perAlias) };
};

/**
 * Dựng danh sách giá trị lọc có kèm số sản phẩm thật, tính trên chính dữ liệu đang có
 * (không hardcode), nên UI không bao giờ mời người mua chọn một mức giá lọc trả 0 kết quả.
 */
export const collectSpecFacets = (rows = []) => {
    const counters = Object.fromEntries(SPEC_FILTER_KEYS.map((s) => [s.key, new Map()]));

    rows.forEach((row) => {
        const specs = parseSpecs(row.specifications);
        SPEC_FILTER_KEYS.forEach(({ key, aliases }) => {
            const hit = aliases.map((a) => specs[a]).find((v) => v !== undefined && v !== null && String(v).trim() !== "");
            if (hit === undefined) return;
            const value = String(hit).trim();
            const counter = counters[key];
            counter.set(value, (counter.get(value) || 0) + 1);
        });
    });

    return SPEC_FILTER_KEYS.map(({ key, label }) => ({
        key,
        label,
        options: [...(counters[key] || new Map())]
            .map(([value, count]) => ({ value, count }))
            .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "vi")),
    })).filter((facet) => facet.options.length > 0);
};
