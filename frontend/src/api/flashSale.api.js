import axios from './axios';

// AppError của backend nằm ở response.data.message — tách ra đây để các trang
// đọc err.message được giống nhau (xem voucher.api, warranty.api)
const run = async (call) => {
    try {
        const { data } = await call();
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const flashSaleApi = {
    // Khách: không cần đăng nhập. current trả { server_time, state, sale, upcoming, items }
    getCurrent: (params) => run(() => axios.get('/flash-sales/current', { params })),
    // GET /flash-sales/:id với id = product_id → { flash: null } khi không có ưu đãi
    getProductFlash: (productId) => run(() => axios.get(`/flash-sales/${productId}`)),

    // Admin
    getAll: (params) => run(() => axios.get('/admin/flash-sales', { params })),
    getStats: () => run(() => axios.get('/admin/flash-sales/stats')),
    getDetail: (id) => run(() => axios.get(`/admin/flash-sales/${id}`)),
    create: (payload) => run(() => axios.post('/admin/flash-sales', payload)),
    update: (id, payload) => run(() => axios.put(`/admin/flash-sales/${id}`, payload)),
    setStatus: (id, status) => run(() => axios.patch(`/admin/flash-sales/${id}/status`, { status })),
    // Route /status/bulk và /bulk đăng ký trước /:id ở backend
    bulkSetStatus: (ids, status) => run(() => axios.patch('/admin/flash-sales/status/bulk', { ids, status })),
    bulkDelete: (ids) => run(() => axios.delete('/admin/flash-sales/bulk', { data: { ids } })),
    delete: (id) => run(() => axios.delete(`/admin/flash-sales/${id}`)),
};

export default flashSaleApi;
