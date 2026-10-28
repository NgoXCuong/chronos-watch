import axios from './axios';

const reviewApi = {
    getFeatured: async (limit = 3) => {
        try {
            const response = await axios.get('/reviews/featured', { params: { limit } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getByProduct: async (productId) => {
        try {
            const response = await axios.get(`/reviews/product/${productId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    create: async (reviewData) => {
        try {
            const response = await axios.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default reviewApi;
