import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/client/auth/LoginPage';
import RegisterPage from '../pages/client/auth/RegisterPage';
import HomePage from '../pages/client/home/HomePage';
import ClientProductListPage from '../pages/client/products/ClientProductListPage';
import ProductDetailPage from '../pages/client/products/ProductDetailPage';
import CartPage from '../pages/client/CartPage';
import WishlistPage from '../pages/client/WishlistPage';
import CheckoutPage from '../pages/client/CheckoutPage';
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
import VoucherListPage from '../pages/admin/vouchers/VoucherListPage';
import ProfilePage from '../pages/client/profile/ProfilePage';
import { useAuth } from '../hooks/useAuth';
import CategoryListPage from '../pages/admin/categories/CategoryListPage';
import CheckoutSuccessPage from '../pages/client/CheckoutSuccessPage';
import CheckoutFailPage from '../pages/client/CheckoutFailPage';
import BrandListPage from '../pages/admin/brands/BrandListPage';
import MyOrdersPage from '../pages/client/orders/MyOrdersPage';
import MyOrderDetailPage from '../pages/client/orders/MyOrderDetailPage';
import BrandDiscoveryPage from '../pages/client/BrandListPage';
import AboutPage from '../pages/client/AboutPage';

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
            <Route
                path="/cart"
                element={
                    <MainLayout>
                        <CartPage />
                    </MainLayout>
                }
            />
            <Route
                path="/wishlist"
                element={
                    <MainLayout>
                        <WishlistPage />
                    </MainLayout>
                }
            />
            <Route
                path="/checkout"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CheckoutPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/checkout/success"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CheckoutSuccessPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/checkout/fail"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CheckoutFailPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/about"
                element={
                    <MainLayout>
                        <AboutPage />
                    </MainLayout>
                }
            />
            <Route
                path="/brands"
                element={
                    <MainLayout>
                        <BrandDiscoveryPage />
                    </MainLayout>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <MyOrdersPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/:id"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <MyOrderDetailPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ProfilePage />
                        </MainLayout>
                    </ProtectedRoute>
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
