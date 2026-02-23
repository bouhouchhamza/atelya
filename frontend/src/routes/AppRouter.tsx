import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreLayout } from '../components/layout/StoreLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedAdminRoute, PublicAdminOnlyRoute } from './ProtectedRoute';
import { usePageViewTracking } from '../hooks/usePageViewTracking';

const HomePage = lazy(() => import('../pages/Store/HomePage'));
const ProductsPage = lazy(() => import('../pages/Store/ProductsPage'));
const ProductDetailsPage = lazy(() => import('../pages/Store/ProductDetailsPage'));
const CartPage = lazy(() => import('../pages/Store/CartPage'));
const CheckoutPage = lazy(() => import('../pages/Store/CheckoutPage'));

const AdminLoginPage = lazy(() => import('../pages/Admin/LoginPage'));
const AdminDashboardPage = lazy(() => import('../pages/Admin/DashboardPage'));
const ProductsAdminPage = lazy(() => import('../pages/Admin/ProductsAdminPage'));
const CategoriesAdminPage = lazy(() => import('../pages/Admin/CategoriesAdminPage'));
const OrdersAdminPage = lazy(() => import('../pages/Admin/OrdersAdminPage'));
const CustomersAdminPage = lazy(() => import('../pages/Admin/CustomersAdminPage'));

function TrackedRoutes() {
  usePageViewTracking();

  return (
    <Suspense fallback={<div className="p-6 text-sm text-zinc-500">Loading...</div>}>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        <Route element={<PublicAdminOnlyRoute />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="categories" element={<CategoriesAdminPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
            <Route path="customers" element={<CustomersAdminPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <TrackedRoutes />
    </BrowserRouter>
  );
}
