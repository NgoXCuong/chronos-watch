import { useState, useEffect, useCallback } from 'react';
import authApi from '../api/auth.api';

import { AuthContext } from "./auth-state";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthStatus = useCallback(async () => {
        try {
            const userData = await authApi.getProfile();
            setUser(userData);
            setIsAuthenticated(true);
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = async (credentials) => {
        const data = await authApi.login(credentials);
        if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
        }
        return data;
    };

    const register = (userData) => authApi.register(userData);

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        setUser(prevUser => ({ ...prevUser, ...userData }));
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};