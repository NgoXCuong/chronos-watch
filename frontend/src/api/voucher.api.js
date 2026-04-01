import axios from './axios';

const voucherApi = {
    getAll: async () => {
        const { data } = await axios.get('/vouchers');
        return data;
    },
    getDetail: async (id) => {
        const { data } = await axios.get(`/vouchers/${id}`);
        return data;
    },
    create: async (payload) => {
        const { data } = await axios.post('/vouchers', payload);
        return data;
    },
    update: async (id, payload) => {
        const { data } = await axios.put(`/vouchers/${id}`, payload);
        return data;
    },
    delete: async (id) => {
        const { data } = await axios.delete(`/vouchers/${id}`);
        return data;
    }
};

export default voucherApi;
