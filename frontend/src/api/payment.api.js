import axios from './axios';

const paymentApi = {
    getBankConfig: async () => {
        const { data } = await axios.get('/payments/bank-config');
        return data;
    },
    confirmSePayPayment: async (orderId) => {
        const { data } = await axios.post(`/payments/sepay/mock-payment/${orderId}`);
        return data;
    }
};

export default paymentApi;
