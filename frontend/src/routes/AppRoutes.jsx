import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/client/auth/LoginPage';
import RegisterPage from '../pages/client/auth/RegisterPage';
import HomePage from '../pages/client/home/HomePage';
import ClientProductListPage from '../pages/client/products/ClientProductListPage';
import ProductDetailPage from '../pages/client/products/ProductDetailPage';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import DashboardPage from '../pages/admin/DashboardPage';
import ProductListPage from '../pages/admin/products/ProductListPage';
import ProductEditorPage from '../pages/admin/products/ProductEditorPage';
import OrderListPage from '../pages/admin/orders/OrderListPage';
import OrderDetailPage from '../pages/admin/orders/OrderDetailPage';
import UserListPage from '../pages/admin/users/UserListPage';
import ReviewListPage from '../pages/admin/reviews/ReviewListPage';
import BrandListPage from '../pages/admin/brands/BrandListPage';
import CategoryListPage from '../pages/admin/categories/CategoryListPage';
import VoucherListPage from '../pages/admin/vouchers/VoucherListPage';
import BannerListPage from '../pages/admin/banners/BannerListPage';
import { useAuth } from '../hooks/useAuth';

const AppRoutes = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes - No Layout */}
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={user?.role === 'admin' ? "/admin" : "/"} />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={user?.role === 'admin' ? "/admin" : "/"} />} />

            {/* Main Routes - With MainLayout */}
            <Route 
                path="/" 
                element={
                    <MainLayout>
                        <HomePage />
                    </MainLayout>
                } 
            />
            <Route 
                path="/products" 
                element={
                    <MainLayout>
                        <ClientProductListPage />
                    </MainLayout>
                } 
            />
            <Route 
                path="/products/:slug" 
                element={
                    <MainLayout>
                        <ProductDetailPage />
                    </MainLayout>
                } 
            />

            {/* Admin Routes - With AdminLayout & ProtectedRoute */}
            <Route 
                path="/admin/*" 
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminLayout>
                            <Routes>
                                <Route index element={<DashboardPage />} />
                                <Route path="products" element={<ProductListPage />} />
                                <Route path="products/create" element={<ProductEditorPage />} />
                                <Route path="products/edit/:id" element={<ProductEditorPage />} />
                                <Route path="orders" element={<OrderListPage />} />
                                <Route path="orders/:id" element={<OrderDetailPage />} />
                                <Route path="reviews" element={<ReviewListPage />} />
                                <Route path="brands" element={<BrandListPage />} />
                                <Route path="categories" element={<CategoryListPage />} />
                                <Route path="vouchers" element={<VoucherListPage />} />
                                <Route path="banners" element={<BannerListPage />} />
                                <Route path="users" element={<UserListPage />} />
                            </Routes>
                        </AdminLayout>
                    </ProtectedRoute>
                } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
