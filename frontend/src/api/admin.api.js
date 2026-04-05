import axios from './axios';

const adminApi = {
    getDashboard: async () => {
        try {
            const response = await axios.get('/admin/dashboard');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getRevenueStats: async (startDate, endDate) => {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            const response = await axios.get('/admin/revenue-stats', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getAllUsers: async () => {
        try {
            const response = await axios.get('/admin/users');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getAllOrders: async () => {
        try {
            const response = await axios.get('/admin/orders');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getOrderDetail: async (id) => {
        try {
            const response = await axios.get(`/admin/orders/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    updateOrderStatus: async (id, status, note) => {
        try {
            const response = await axios.patch(`/orders/${id}/status`, { status, note });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    markOrderAsPaid: async (id) => {
        try {
            const response = await axios.patch(`/orders/${id}/mark-paid`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getNotifications: async () => {
        try {
            const response = await axios.get('/admin/notifications');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getAllReviews: async () => {
        try {
            const response = await axios.get('/admin/reviews');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    updateReviewStatus: async (id, is_active) => {
        try {
            const response = await axios.patch(`/admin/reviews/${id}/status`, { is_active });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    replyToReview: async (id, reply) => {
        try {
            const response = await axios.post(`/admin/reviews/${id}/reply`, { reply });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default adminApi;
