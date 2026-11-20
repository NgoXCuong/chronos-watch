import axios from './axios';

const paymentApi = {
    getBankConfig: async () => {
        const { data } = await axios.get('/payments/bank-config');
        return data;
    },
    mockSePayPayment: async (orderId) => {
        const { data } = await axios.post(`/payments/sepay/mock-payment/${orderId}`);
        return data;
    },
    checkSePayPayment: async (orderId) => {
        const { data } = await axios.get(`/payments/sepay/info/${orderId}`);
        if (data.order?.payment_status !== 'paid') {
            throw new Error('Chưa nhận được xác nhận thanh toán từ ngân hàng. Vui lòng đợi và kiểm tra lại.');
        }
        return data;
    }
};

export default paymentApi;
