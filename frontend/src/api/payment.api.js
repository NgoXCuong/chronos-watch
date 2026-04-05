import axios from './axios';

const paymentApi = {
    getBankConfig: async () => {
        const { data } = await axios.get('/payments/bank-config');
        return data;
    }
};

export default paymentApi;
