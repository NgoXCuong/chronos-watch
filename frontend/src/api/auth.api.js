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
    },
    updateProfile: async (formData) => {
        const { data } = await api.put("/auth/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },
    changePassword: async (passwordData) => {
        const { data } = await api.put("/auth/change-password", passwordData);
        return data;
    }
};

export default authApi;
