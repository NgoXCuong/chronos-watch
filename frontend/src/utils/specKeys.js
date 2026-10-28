// Bộ key thông số kỹ thuật chuẩn hóa cho ngành đồng hồ.
// Key tiếng Anh (giá trị JSON trong products.specifications) khớp với bộ lọc
// backend productService.getAll (specFilters); nhãn tiếng Việt dùng để hiển thị.
export const SPEC_KEYS = [
    { key: 'movement',         label: 'Loại máy' },
    { key: 'glass',            label: 'Kính' },
    { key: 'water_resistance', label: 'Chống nước' },
    { key: 'case_material',    label: 'Chất liệu vỏ' },
    { key: 'case_size',        label: 'Kích thước mặt' },
    { key: 'strap_material',   label: 'Chất liệu dây' },
    { key: 'dial_color',       label: 'Màu mặt số' },
    { key: 'functions',        label: 'Chức năng' },
];

const LABELS = Object.fromEntries(SPEC_KEYS.map(s => [s.key, s.label]));

// Trả về nhãn tiếng Việt cho key chuẩn; giữ nguyên key nếu là key tùy chỉnh cũ
export const specLabel = (key) => LABELS[key] || key;
