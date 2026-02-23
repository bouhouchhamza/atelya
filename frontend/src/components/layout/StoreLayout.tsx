import { Link, NavLink, Outlet } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '../../app/providers/CartProvider';
import { cn } from '../../lib/utils';
import { useSettings } from '../../contexts/SettingsContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/checkout', label: 'Checkout' },
];

export function StoreLayout() {
  const { count } = useCart();
  const settings = useSettings();
  const brandName = settings?.store_name ?? 'ATELYA Electronics';

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            {settings?.store_logo_url ? (
              <img src={settings.store_logo_url} alt={brandName} className="h-8 w-auto object-contain" />
            ) : null}
            <span>{brandName}</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white',
                    isActive && 'text-zinc-900 dark:text-white'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {count}
                </span>
              ) : null}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
