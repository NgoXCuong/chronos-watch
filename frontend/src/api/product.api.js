import axios from './axios';

const productApi = {
    getAll: async (params) => {
        try {
            const response = await axios.get('/products', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getDetail: async (id_or_slug) => {
        try {
            const response = await axios.get(`/products/${id_or_slug}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    // Trang quản trị: lấy cả sản phẩm ngừng bán và lọc theo trạng thái.
    getAdminAll: async (params) => {
        try {
            const response = await axios.get('/products/admin', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    // Form sửa cần mở được sản phẩm inactive; không tăng lượt xem.
    getAdminDetail: async (id) => {
        try {
            const response = await axios.get(`/products/admin/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    // Giá trị lọc + khoảng giá thật đang có trong catalog
    getFacets: async () => {
        try {
            const { data } = await axios.get('/products/facets');
            return data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    create: async (formData) => {
        try {
            const response = await axios.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    update: async (id, formData) => {
        try {
            const response = await axios.put(`/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    // Sản phẩm không xóa hẳn → hàng loạt chỉ đổi status (active = đang bán, inactive = ngừng bán)
    bulkUpdateStatus: async (ids, status) => {
        try {
            const response = await axios.patch('/products/status/bulk', { ids, status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default productApi;
