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
    }
};

export default productApi;
