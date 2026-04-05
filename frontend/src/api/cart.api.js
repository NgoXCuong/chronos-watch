import axios from './axios';

const cartApi = {
    getCart: () => axios.get('/carts'),
    add: (productId, quantity) => axios.post('/carts/add', { product_id: productId, quantity }),
    update: (productId, quantity) => axios.put('/carts/update', { product_id: productId, quantity }),
    remove: (productId) => axios.delete(`/carts/remove/${productId}`),
    clear: () => axios.delete('/carts/clear'),
    sync: (items) => axios.post('/carts/sync', { items }),
};

export default cartApi;
