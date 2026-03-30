import api from "./axios";

const authApi = {
    login: async (credentials) => {
        const { data } = await api.post("/auth/login", credentials);
        return data;
    },
    register: async (userData) => {
        const { data } = await api.post("/auth/register", userData);
        return data;
    },
    getProfile: async () => {
        const { data } = await api.get("/auth/profile");
        return data;
    },
    logout: async () => {
        const { data } = await api.post("/auth/logout");
        return data;
    }
};

export default authApi;
