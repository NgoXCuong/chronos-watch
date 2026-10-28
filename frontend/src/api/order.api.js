import axios from './axios';

const orderApi = {
    checkout: async (orderData) => {
        const response = await axios.post('/orders/checkout', orderData);
        return response.data;
    },
    // Trả về {count, page, limit, totalPages, orders} — lọc/tìm/sort đều ở server
    getMyOrders: async (params = {}) => {
        const { data } = await axios.get('/orders/my-orders', {
            params: Object.fromEntries(
                Object.entries(params).filter(([, value]) => value !== '' && value != null),
            ),
        });
        return data;
    },
    getOrderDetail: async (id) => {
        const response = await axios.get(`/orders/${id}`);
        return response.data;
    },
    // Backend nhận note (lý do hủy) và ghi vào cancel_reason của đơn
    cancelOrder: async (id, note) => {
        const response = await axios.post(`/orders/${id}/cancel`, { note });
        return response.data;
    },
    retryPayment: async (id) => {
        const response = await axios.post(`/orders/${id}/retry-payment`);
        return response.data;
    },
    switchCOD: async (id) => {
        const response = await axios.patch(`/orders/${id}/switch-cod`);
        return response.data;
    },
};

export default orderApi;
