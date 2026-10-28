import { FLASH_SALE_MAX } from '../constants/flashSale';

const pad = (n) => String(n).padStart(2, '0');

// start_date/end_date là DATETIME (không phải DATE): Flash Sale bán theo khung giờ,
// nên form dùng input type="datetime-local" — giá trị "YYYY-MM-DDTHH:mm" giờ máy khách.
export const toLocalDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const isPositiveInt = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

export const emptyFlashItem = () => ({
    product_id: '',
    name: '',
    image_url: '',
    list_price: 0,
    flash_price: '',
    quota: 10,
    sold_count: 0,
    per_user_limit: 1,
});

// Validation bám đúng guard của backend (flash-sale-item.service.js) để admin sửa
// ngay tại form thay vì nhận 400 sau khi bấm Lưu.
export const validateFlashSaleItems = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return [{ product_id: 'Chưa có sản phẩm nào trong đợt.' }];
    const seen = new Set();
    return items.map((item) => {
        const errors = {};
        const productId = item.product_id === '' ? null : Number(item.product_id);
        if (!productId) errors.product_id = 'Chọn sản phẩm cho dòng này.';
        else if (seen.has(productId)) errors.product_id = 'Sản phẩm bị lặp trong danh sách.';
        seen.add(productId);

        const price = Number(item.flash_price);
        const listPrice = Number(item.list_price);
        if (item.flash_price === '' || !Number.isFinite(price) || price <= 0) {
            errors.flash_price = 'Giá Flash phải lớn hơn 0.';
        } else if (Number.isFinite(listPrice) && listPrice > 0 && price >= listPrice) {
            errors.flash_price = `Giá Flash phải thấp hơn giá niêm yết (${listPrice.toLocaleString('vi-VN')}đ).`;
        }

        if (!isPositiveInt(item.quota)) errors.quota = 'Số suất phải là số nguyên > 0.';
        else if (Number(item.sold_count) > Number(item.quota)) {
            errors.quota = `Đã bán ${item.sold_count} suất — số suất không được nhỏ hơn.`;
        }
        if (item.per_user_limit !== '' && item.per_user_limit !== null && !Number.isInteger(Number(item.per_user_limit))) {
            errors.per_user_limit = 'Hạn mức/khách phải là số nguyên.';
        }
        return errors;
    });
};

export const validateFlashSale = (form = {}) => {
    const errors = {};
    const name = (form.name || '').trim();
    if (!name) errors.name = 'Tên đợt Flash Sale không được để trống.';
    else if (name.length > FLASH_SALE_MAX.name) errors.name = `Tên đợt tối đa ${FLASH_SALE_MAX.name} ký tự.`;

    if ((form.description || '').trim().length > FLASH_SALE_MAX.description) {
        errors.description = `Mô tả tối đa ${FLASH_SALE_MAX.description} ký tự.`;
    }
    if (!form.start_date) errors.start_date = 'Chọn mốc bắt đầu.';
    if (!form.end_date) errors.end_date = 'Chọn mốc kết thúc.';
    if (form.start_date && form.end_date && new Date(form.start_date) >= new Date(form.end_date)) {
        errors.end_date = 'Mốc kết thúc phải sau mốc bắt đầu.';
    }

    const items = validateFlashSaleItems(form.items);
    return { ...errors, items, hasItemError: items.some((e) => Object.keys(e).length > 0) };
};

// per_user_limit 0 = không giới hạn khách (đúng nghĩa cột INT NOT NULL DEFAULT 1 ở backend);
// dòng chưa chọn sản phẩm bị loại để không nhận 400 "Thiếu sản phẩm".
export const buildFlashSalePayload = (form = {}) => ({
    name: (form.name || '').trim(),
    description: (form.description || '').trim() || null,
    start_date: new Date(form.start_date).toISOString(),
    end_date: new Date(form.end_date).toISOString(),
    status: form.status || 'active',
    items: (form.items || [])
        .filter((item) => item.product_id)
        .map((item) => ({
            product_id: Number(item.product_id),
            flash_price: Math.round(Number(item.flash_price)),
            quota: Math.round(Number(item.quota)),
            per_user_limit: item.per_user_limit === '' || item.per_user_limit === null ? 1 : Math.round(Number(item.per_user_limit)),
        })),
});
