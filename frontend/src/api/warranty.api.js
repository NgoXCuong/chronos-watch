import axios from './axios';

// AppError của backend nằm ở response.data.message — tách ra đây để các trang
// đọc err.message được giống nhau (xem voucher.api, banner.api)
const run = async (call) => {
    try {
        const { data } = await call();
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const warrantyApi = {
    // Khách hàng: GET /warranties trả { total, page, limit, warranties }
    getMy: (params) => run(() => axios.get('/warranties', { params })),
    getMyOne: (id) => run(() => axios.get(`/warranties/${id}`)),
    createRequest: (id, issue) => run(() => axios.post(`/warranties/${id}/request`, { issue })),

    // Admin
    getAll: (params) => run(() => axios.get('/admin/warranties', { params })),
    getStats: () => run(() => axios.get('/admin/warranties/stats')),
    getDetail: (id) => run(() => axios.get(`/admin/warranties/${id}`)),
    update: (id, payload) => run(() => axios.patch(`/admin/warranties/${id}`, payload)),
    delete: (id) => run(() => axios.delete(`/admin/warranties/${id}`)),
    // Route /bulk đăng ký trước /:id ở backend — ở đây chỉ cần gọi đúng đường dẫn
    bulkSetStatus: (ids, status) => run(() => axios.patch('/admin/warranties/status/bulk', { ids, status })),
    bulkDelete: (ids) => run(() => axios.delete('/admin/warranties/bulk', { data: { ids } })),

    getRequests: (params) => run(() => axios.get('/admin/warranty-requests', { params })),
    replyRequest: (id, payload) => run(() => axios.patch(`/admin/warranty-requests/${id}/reply`, payload)),
};

export default warrantyApi;
