import axios from './axios';

const bannerApi = {
    getAll: async (params = {}) => {
        const { data } = await axios.get('/banners', { params });
        return data;
    },
    getDetail: async (id) => {
        const { data } = await axios.get(`/banners/${id}`);
        return data;
    },
    create: async (formData) => {
        const { data } = await axios.post('/banners', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    update: async (id, formData) => {
        const { data } = await axios.put(`/banners/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },
    toggleStatus: async (id) => {
        const { data } = await axios.patch(`/banners/${id}/toggle-status`);
        return data;
    },
    delete: async (id) => {
        const { data } = await axios.delete(`/banners/${id}`);
        return data;
    }
};

export default bannerApi;
