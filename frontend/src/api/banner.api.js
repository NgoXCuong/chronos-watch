import axios from './axios';

const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

// AppError của backend nằm ở response.data.message — tách ra đây để các trang
// admin đọc err.message được giống nhau (xem brand.api)
const run = async (call) => {
    try {
        const { data } = await call();
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const bannerApi = {
    // Public: banner đang bật + trong khoảng hiệu lực (HeroBanner trang chủ)
    getActive: () => run(() => axios.get('/banners')),
    // Admin: /banners/all nhận search/is_active/schedule/page/limit/sort/dir, trả {count, rows}
    getAll: (params) => run(() => axios.get('/banners/all', { params })),
    create: (formData) => run(() => axios.post('/banners', formData, MULTIPART)),
    update: (id, formData) => run(() => axios.put(`/banners/${id}`, formData, MULTIPART)),
    toggleStatus: (id) => run(() => axios.patch(`/banners/${id}/toggle-status`)),
    delete: (id) => run(() => axios.delete(`/banners/${id}`)),
    bulkDelete: (ids) => run(() => axios.delete('/banners/bulk', { data: { ids } })),
    bulkSetVisibility: (ids, is_active) => run(() => axios.patch('/banners/status/bulk', { ids, is_active }))
};

export default bannerApi;
