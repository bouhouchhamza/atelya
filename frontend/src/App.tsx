import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { QueryProvider } from './lib/queryClient.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useDeferredMount } from './hooks/useDeferredMount';
import { useTrackPageView } from './hooks/useTrackPageView';
import { AdminAuthProvider } from './admin/auth/AdminAuthContext';
import { ProtectedAdminRoute, PublicAdminRoute } from './admin/auth/AdminRouteGuards';
import Hero from './sections/Hero';
import './App.css';

const Shop = lazy(() => import('./pages/Shop'));
const FeaturedProducts = lazy(() => import('./sections/FeaturedProducts'));
const Categories = lazy(() => import('./sections/Categories'));
const Newsletter = lazy(() => import('./sections/Newsletter'));
const Footer = lazy(() => import('./sections/Footer'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLoginPage'));
const AdminLayout = lazy(() => import('./admin/layout/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./admin/pages/DashboardPage'));
const AdminProductsPage = lazy(() => import('./admin/pages/ProductsPage'));
const AdminProductFormPage = lazy(() => import('./admin/pages/ProductFormPage'));
const AdminCategoriesPage = lazy(() => import('./admin/pages/CategoriesPage'));
const AdminSettingsPage = lazy(() => import('./admin/pages/SettingsPage'));
const Maintenance = lazy(() => import('./sections/Maintenance').then(mod => ({ default: mod.Maintenance })));

interface DeferredSectionProps {
  children: ReactNode;
  minHeightClass: string;
  rootMargin?: string;
}

function DeferredSection({
  children,
  minHeightClass,
  rootMargin = '180px 0px',
}: DeferredSectionProps) {
  const { targetRef, shouldMount } = useDeferredMount<HTMLDivElement>({
    delayMs: 0,
    rootMargin,
    threshold: 0.01,
  });

  return (
    <section ref={targetRef}>
      {shouldMount ? children : <div className={minHeightClass} aria-hidden="true" />}
    </section>
  );
}

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AdminAuthProvider>
            <Router>
              <AppRoutes />
            </Router>
          </AdminAuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

function AppRoutes() {
  useTrackPageView();
  const settings = useSettings();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (settings?.maintenance_mode && !isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-primary-50 dark:bg-dark-900" />}>
        <Maintenance />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-900 transition-colors">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <DeferredSection minHeightClass="h-[420px]">
                <Suspense fallback={<div className="h-[420px]" />}><FeaturedProducts /></Suspense>
              </DeferredSection>
              <DeferredSection minHeightClass="h-[260px]">
                <Suspense fallback={<div className="h-[260px]" />}><Categories /></Suspense>
              </DeferredSection>
              <DeferredSection minHeightClass="h-[220px]">
                <Suspense fallback={<div className="h-[220px]" />}><Newsletter /></Suspense>
              </DeferredSection>
              <DeferredSection minHeightClass="h-[160px]">
                <Suspense fallback={<div className="h-[160px]" />}><Footer /></Suspense>
              </DeferredSection>
            </>
          }
        />
        <Route
          path="/shop"
          element={<Suspense fallback={<div className="min-h-screen bg-primary-50 dark:bg-dark-900" />}><Shop /></Suspense>}
        />
        <Route
          path="/admin/login"
          element={
            <PublicAdminRoute>
              <Suspense fallback={<div className="min-h-screen bg-primary-50 dark:bg-dark-900" />}><AdminLogin /></Suspense>
            </PublicAdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Suspense fallback={<div className="min-h-screen bg-primary-50 dark:bg-dark-900" />}><AdminLayout /></Suspense>
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="dashboard"
            element={<Suspense fallback={<div className="p-6 text-sm text-primary-600 dark:text-primary-400">Loading...</div>}><AdminDashboardPage /></Suspense>}
          />
          <Route
            path="products"
            element={<Suspense fallback={<div className="p-6 text-sm text-primary-600 dark:text-primary-400">Loading...</div>}><AdminProductsPage /></Suspense>}
          />
          <Route
            path="products/new"
            element={<Suspense fallback={<div className="p-6 text-sm text-primary-600 dark:text-primary-400">Loading...</div>}><AdminProductFormPage /></Suspense>}
          />
          <Route
            path="products/:id/edit"
            element={<Suspense fallback={<div className="p-6 text-sm text-primary-600 dark:text-primary-400">Loading...</div>}><AdminProductFormPage /></Suspense>}
          />
          <Route
            path="categories"
            element={<Suspense fallback={<div className="p-6 text-sm text-primary-600 dark:text-primary-400">Loading...</div>}><AdminCategoriesPage /></Suspense>}
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<div className="p-6 text-sm text-primary-600 dark:text-primary-400">Loading...</div>}>
                <AdminSettingsPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
