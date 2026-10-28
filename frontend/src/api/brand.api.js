import axios from './axios';

const brandApi = {
    getAll: async (params) => {
        try {
            const response = await axios.get('/brands', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getDetail: async (id) => {
        const { data } = await axios.get(`/brands/${id}`);
        return data;
    },
    create: async (formData) => {
        const { data } = await axios.post('/brands', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    update: async (id, formData) => {
        const { data } = await axios.put(`/brands/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    toggleStatus: async (id) => {
        const { data } = await axios.patch(`/brands/${id}/toggle-status`);
        return data;
    },
    delete: async (id) => {
        const { data } = await axios.delete(`/brands/${id}`);
        return data;
    },
    // Xóa nhiều: backend trả {deleted, failed:[{id, reason}]} — thành công một phần là hợp lệ
    bulkDelete: async (ids) => {
        try {
            const { data } = await axios.delete('/brands/bulk', { data: { ids } });
            return data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    bulkSetVisibility: async (ids, is_active) => {
        try {
            const { data } = await axios.patch('/brands/status/bulk', { ids, is_active });
            return data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default brandApi;
