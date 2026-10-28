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
    getAllUsers: async (params) => {
        try {
            const response = await axios.get('/admin/users', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getUserStats: async () => {
        try {
            const response = await axios.get('/admin/users/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getUserDetail: async (id) => {
        try {
            const response = await axios.get(`/admin/users/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    bulkUpdateUserStatus: async (ids, status) => {
        try {
            const response = await axios.patch('/admin/users/status/bulk', { ids, status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getAllOrders: async (params) => {
        try {
            const response = await axios.get('/admin/orders', { params });
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
    // /admin/reviews nhận search (bình luận, tên/email khách, tên sản phẩm) + is_active/
    // rating/replied + page/limit/sort/dir, trả {count, rows}
    getAllReviews: async (params) => {
        try {
            const response = await axios.get('/admin/reviews', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getReviewStats: async () => {
        try {
            const response = await axios.get('/admin/reviews/stats');
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
    },
    deleteReview: async (id) => {
        try {
            const response = await axios.delete(`/admin/reviews/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    updateUserStatus: async (id, status) => {
        try {
            const response = await axios.patch(`/admin/users/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    updateUserRole: async (id, role) => {
        try {
            const response = await axios.patch(`/admin/users/${id}/role`, { role });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    resetUserPassword: async (id, password) => {
        try {
            const response = await axios.patch(`/admin/users/${id}/password`, { password });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default adminApi;
