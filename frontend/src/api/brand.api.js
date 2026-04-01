import axios from './axios';

const brandApi = {
    getAll: async (params = {}) => {
        const { data } = await axios.get('/brands', { params });
        return data;
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
    }
};

export default brandApi;
