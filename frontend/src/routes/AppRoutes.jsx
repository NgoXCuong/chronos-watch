import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// Eager load HomePage for instant first render
import HomePage from '../pages/client/home/HomePage';

// Lazy load client auth pages
const LoginPage = lazy(() => import('../pages/client/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/client/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/client/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/client/auth/ResetPasswordPage'));

// Lazy load client secondary pages
const ClientProductListPage = lazy(() => import('../pages/client/products/ClientProductListPage'));
const ProductDetailPage = lazy(() => import('../pages/client/products/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/client/CartPage'));
const WishlistPage = lazy(() => import('../pages/client/WishlistPage'));
const CheckoutPage = lazy(() => import('../pages/client/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('../pages/client/CheckoutSuccessPage'));
const CheckoutFailPage = lazy(() => import('../pages/client/CheckoutFailPage'));
const AboutPage = lazy(() => import('../pages/client/AboutPage'));
const BrandDiscoveryPage = lazy(() => import('../pages/client/BrandListPage'));
const MyOrdersPage = lazy(() => import('../pages/client/orders/MyOrdersPage'));
const MyOrderDetailPage = lazy(() => import('../pages/client/orders/MyOrderDetailPage'));
const ProfilePage = lazy(() => import('../pages/client/profile/ProfilePage'));

// Lazy load all Admin pages (keeps heavy bundles like charts, editors, xlsx out of customer bundle)
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const ProductListPage = lazy(() => import('../pages/admin/products/ProductListPage'));
const ProductEditorPage = lazy(() => import('../pages/admin/products/ProductEditorPage'));
const OrderListPage = lazy(() => import('../pages/admin/orders/OrderListPage'));
const OrderDetailPage = lazy(() => import('../pages/admin/orders/OrderDetailPage'));
const UserListPage = lazy(() => import('../pages/admin/users/UserListPage'));
const ReviewListPage = lazy(() => import('../pages/admin/reviews/ReviewListPage'));
const VoucherListPage = lazy(() => import('../pages/admin/vouchers/VoucherListPage'));
const CategoryListPage = lazy(() => import('../pages/admin/categories/CategoryListPage'));
const BrandListPage = lazy(() => import('../pages/admin/brands/BrandListPage'));

const PageLoader = () => (
    <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

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
        <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Public Routes - No Layout */}
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={user?.role === 'admin' ? "/admin" : "/"} />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={user?.role === 'admin' ? "/admin" : "/"} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

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
    </Suspense>
    );
};

export default AppRoutes;
