import axios from './axios';

const categoryApi = {
    getAll: async (params = {}) => {
        const { data } = await axios.get('/categories', { params });
        return data;
    },
    getDetail: async (id) => {
        const { data } = await axios.get(`/categories/${id}`);
        return data;
    },
    create: async (payload) => {
        const { data } = await axios.post('/categories', payload);
        return data;
    },
    update: async (id, payload) => {
        const { data } = await axios.put(`/categories/${id}`, payload);
        return data;
    },
    toggleStatus: async (id) => {
        const { data } = await axios.patch(`/categories/${id}/toggle-status`);
        return data;
    },
    delete: async (id) => {
        const { data } = await axios.delete(`/categories/${id}`);
        return data;
    }
};

export default categoryApi;
