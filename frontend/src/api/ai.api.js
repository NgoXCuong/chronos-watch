import axiosClient from './axios';

const chat = async (message, history) => {
    return axiosClient.post('/ai/chat', { message, history });
};

export default {
    chat
};
