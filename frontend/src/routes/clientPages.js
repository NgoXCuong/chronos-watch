import { lazy } from "react";
export const MyVouchersPage = lazy(() => import('../pages/client/MyVouchersPage')); 
// Lazy load client auth pages
export const LoginPage = lazy(() => import("../pages/client/auth/LoginPage"));
export const RegisterPage = lazy(() => import("../pages/client/auth/RegisterPage"));
export const ForgotPasswordPage = lazy(
  () => import("../pages/client/auth/ForgotPasswordPage"),
);
export const ResetPasswordPage = lazy(
  () => import("../pages/client/auth/ResetPasswordPage"),
);

// Lazy load client secondary pages
export const ClientProductListPage = lazy(
  () => import("../pages/client/products/ClientProductListPage"),
);
export const ProductDetailPage = lazy(
  () => import("../pages/client/products/ProductDetailPage"),
);
export const CartPage = lazy(() => import("../pages/client/CartPage"));
export const WishlistPage = lazy(() => import("../pages/client/WishlistPage"));
export const CheckoutPage = lazy(() => import("../pages/client/CheckoutPage"));
export const CheckoutSuccessPage = lazy(
  () => import("../pages/client/CheckoutSuccessPage"),
);
export const CheckoutFailPage = lazy(() => import("../pages/client/CheckoutFailPage"));
export const AboutPage = lazy(() => import("../pages/client/AboutPage"));
export const BrandDiscoveryPage = lazy(() => import("../pages/client/BrandListPage"));
export const MyOrdersPage = lazy(() => import("../pages/client/orders/MyOrdersPage"));
export const MyOrderDetailPage = lazy(
  () => import("../pages/client/orders/MyOrderDetailPage"),
);
export const MyWarrantiesPage = lazy(
  () => import("../pages/client/warranties/MyWarrantiesPage"),
);
export const WarrantyDetailPage = lazy(
  () => import("../pages/client/warranties/WarrantyDetailPage"),
);
export const NotificationsPage = lazy(
  () => import("../pages/client/notifications/NotificationsPage"),
);
export const ProfilePage = lazy(() => import("../pages/client/profile/ProfilePage"));

export const VouchersPage = lazy(() => import("../pages/client/VouchersPage"));
