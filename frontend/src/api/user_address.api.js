import axios from './axios';

const userAddressApi = {
    getAll: () => axios.get('/addresses'),
    getOne: (id) => axios.get(`/addresses/${id}`),
    create: (data) => axios.post('/addresses', data),
    update: (id, data) => axios.put(`/addresses/${id}`, data),
    delete: (id) => axios.delete(`/addresses/${id}`),
    setDefault: (id) => axios.patch(`/addresses/${id}/default`),
};

export default userAddressApi;
