import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

// Eager load HomePage for instant first render
import HomePage from "../pages/client/home/HomePage";

import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, ClientProductListPage, ProductDetailPage, CartPage, WishlistPage, CheckoutPage, CheckoutSuccessPage, CheckoutFailPage, AboutPage, BrandDiscoveryPage, MyOrdersPage, MyOrderDetailPage, MyWarrantiesPage, WarrantyDetailPage, NotificationsPage, ProfilePage, VouchersPage, MyVouchersPage } from "./clientPages";

// Lazy load all Admin pages (keeps heavy bundles like charts, editors, xlsx out of customer bundle)
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));
const ProductListPage = lazy(
  () => import("../pages/admin/products/ProductListPage"),
);
const ProductEditorPage = lazy(
  () => import("../pages/admin/products/ProductEditorPage"),
);
const OrderListPage = lazy(() => import("../pages/admin/orders/OrderListPage"));
const OrderDetailPage = lazy(
  () => import("../pages/admin/orders/OrderDetailPage"),
);
const UserListPage = lazy(() => import("../pages/admin/users/UserListPage"));
const ReviewListPage = lazy(
  () => import("../pages/admin/reviews/ReviewListPage"),
);
const VoucherListPage = lazy(
  () => import("../pages/admin/vouchers/VoucherListPage"),
);
const FlashSaleListPage = lazy(
  () => import("../pages/admin/flashSales/FlashSaleListPage"),
);
const CategoryListPage = lazy(
  () => import("../pages/admin/categories/CategoryListPage"),
);
const BrandListPage = lazy(() => import("../pages/admin/brands/BrandListPage"));
const BannerListPage = lazy(
  () => import("../pages/admin/banners/BannerListPage"),
);
const WarrantyListPage = lazy(
  () => import("../pages/admin/warranties/WarrantyListPage"),
);
const AdminNotificationsPage = lazy(
  () => import("../pages/admin/notifications/AdminNotificationsPage"),
);

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-navy-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-navy-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={user?.role === "admin" ? "/admin" : "/"} />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <RegisterPage />
            ) : (
              <Navigate to={user?.role === "admin" ? "/admin" : "/"} />
            )
          }
        />
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
        <Route path="/my-vouchers" element={<ProtectedRoute><MainLayout><MyVouchersPage /></MainLayout></ProtectedRoute>} />
        <Route path="/vouchers" element={<MainLayout><VouchersPage /></MainLayout>} />
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
        <Route
          path="/warranties"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyWarrantiesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/warranties/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <WarrantyDetailPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <MainLayout>
                <NotificationsPage />
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
                  <Route
                    path="products/create"
                    element={<ProductEditorPage />}
                  />
                  <Route
                    path="products/edit/:id"
                    element={<ProductEditorPage />}
                  />
                  <Route path="orders" element={<OrderListPage />} />
                  <Route path="orders/:id" element={<OrderDetailPage />} />
                  <Route path="reviews" element={<ReviewListPage />} />
                  <Route path="brands" element={<BrandListPage />} />
                  <Route path="categories" element={<CategoryListPage />} />
                  <Route path="banners" element={<BannerListPage />} />
                  <Route path="vouchers" element={<VoucherListPage />} />
                  <Route path="flash-sales" element={<FlashSaleListPage />} />
                  <Route path="warranties" element={<WarrantyListPage />} />
                  <Route path="users" element={<UserListPage />} />
                  <Route
                    path="notifications"
                    element={<AdminNotificationsPage />}
                  />
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
