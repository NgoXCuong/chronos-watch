import axios from './axios';

// AppError của backend nằm ở response.data.message — tách ra đây để các trang
// admin đọc err.message được giống nhau (xem banner.api, brand.api)
const run = async (call) => {
    try {
        const { data } = await call();
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const voucherApi = {
    getMine: (total) => run(() => axios.get('/vouchers/mine', { params: total === undefined ? {} : { total } })),
    getAvailable: (total) => run(() => axios.get('/vouchers/available', { params: total === undefined ? {} : { total } })),
    gift: (id, userIds) => run(() => axios.post(`/vouchers/${id}/gift`, { user_ids: userIds })),
    getPublic: (total) => run(() => axios.get('/vouchers/public', { params: total === undefined ? {} : { total } })),
    // Admin: /vouchers nhận search/discount_type/status/window/page/limit/sort/dir, trả {count, rows}
    getAll: (params) => run(() => axios.get('/vouchers', { params })),
    getDetail: (id) => run(() => axios.get(`/vouchers/${id}`)),
    create: (payload) => run(() => axios.post('/vouchers', payload)),
    update: (id, payload) => run(() => axios.put(`/vouchers/${id}`, payload)),
    toggleStatus: (id, status) => run(() => axios.patch(`/vouchers/${id}/status`, { status })),
    delete: (id) => run(() => axios.delete(`/vouchers/${id}`)),
    bulkDelete: (ids) => run(() => axios.delete('/vouchers/bulk', { data: { ids } })),
    bulkSetStatus: (ids, status) => run(() => axios.patch('/vouchers/status/bulk', { ids, status })),
    bulkSetVisibility: (ids, isPublic) => run(() => axios.patch('/vouchers/visibility/bulk', { ids, is_public: isPublic })),
    // Checkout dùng res.discount_amount + đọc error.response trực tiếp nên giữ nguyên shape
    validate: async (code, total) => {
        const { data } = await axios.get('/vouchers/validate', { params: { code, total } });
        return data;
    }
};

export default voucherApi;
