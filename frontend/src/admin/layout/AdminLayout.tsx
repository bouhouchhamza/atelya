import { Link, NavLink, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  Squares2X2Icon,
  TagIcon,
  CubeIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';
import { useAdminAuth } from '../auth/AdminAuthContext';

const navigation = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { to: '/admin/products', label: 'Products', icon: CubeIcon },
  { to: '/admin/categories', label: 'Categories', icon: TagIcon },
  { to: '/admin/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export default function AdminLayout() {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[250px_1fr] lg:gap-6 lg:px-6">
        <aside className="rounded-2xl border border-primary-200 bg-white p-4 shadow-lg dark:border-dark-700 dark:bg-dark-800">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/admin/dashboard" className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
              ATELYA Admin
            </Link>
            <Squares2X2Icon className="h-5 w-5 text-primary-500" />
          </div>

          <nav className="space-y-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-dark-700',
                    isActive && 'bg-primary-900 text-white hover:bg-primary-800 dark:bg-primary-100 dark:text-primary-900'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-primary-200 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-dark-600 dark:text-primary-300 dark:hover:bg-dark-700"
            onClick={async () => {
              await logout();
              navigate('/admin/login', { replace: true });
            }}
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="min-w-0 rounded-2xl border border-primary-200 bg-white shadow-lg dark:border-dark-700 dark:bg-dark-800">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-200 px-4 py-3 dark:border-dark-700 lg:px-6">
            <div className="relative w-full max-w-xs">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-400" />
              <input
                type="search"
                placeholder="Search admin..."
                className="h-10 w-full rounded-xl border border-primary-200 bg-white pl-9 pr-3 text-sm text-primary-800 outline-none transition-colors focus:border-primary-400 dark:border-dark-600 dark:bg-dark-900 dark:text-primary-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary-200 text-primary-700 transition-colors hover:bg-primary-100 dark:border-dark-600 dark:text-primary-300 dark:hover:bg-dark-700"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
              </button>
              <div className="rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-primary-700 dark:border-dark-600 dark:bg-dark-700 dark:text-primary-200">
                {user?.name ?? 'Admin'}
              </div>
            </div>
          </header>

          <main className="min-w-0 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
