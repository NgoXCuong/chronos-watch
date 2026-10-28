import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Gửi cookie httpOnly tự động
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isUnauthorized = error.response?.status === 401;
        const isForbiddenNoToken = error.response?.status === 403 && 
            (error.response?.data?.message?.includes('token') || error.response?.data?.message?.includes('đăng nhập'));

        if (isUnauthorized || isForbiddenNoToken) {
            const url = error.config?.url || '';
            const isAuthCheck = url.includes('/auth/profile') || 
                                url.includes('/auth/login') || 
                                url.includes('/auth/register');

            if (!isAuthCheck && typeof window !== 'undefined') {
                const pathname = window.location.pathname;
                if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
                    window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;