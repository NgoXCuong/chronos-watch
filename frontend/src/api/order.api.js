import axios from './axios';

const orderApi = {
    checkout: async (orderData) => {
        const response = await axios.post('/orders/checkout', orderData);
        return response.data;
    },
    getMyOrders: async () => {
        const response = await axios.get('/orders/my-orders');
        return response.data;
    },
    getOrderDetail: async (id) => {
        const response = await axios.get(`/orders/${id}`);
        return response.data;
    },
    cancelOrder: async (id) => {
        const response = await axios.post(`/orders/${id}/cancel`);
        return response.data;
    },
};

export default orderApi;
