import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../auth/AdminAuthContext';

type LoginState = {
  from?: string;
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('admin@atelya.test');
  const [password, setPassword] = useState('password');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = ((location.state as LoginState | null)?.from || '/admin/dashboard');

  return (
    <div className="min-h-screen bg-primary-50 px-6 py-12 dark:bg-dark-900">
      <div className="mx-auto max-w-md rounded-2xl border border-primary-200 bg-white p-6 shadow-lg dark:border-dark-700 dark:bg-dark-800">
        <h1 className="text-2xl font-semibold text-primary-900 dark:text-primary-100">Admin Login</h1>
        <p className="mt-2 text-sm text-primary-600 dark:text-primary-400">
          Sign in to manage products, categories, and analytics.
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            setError(null);

            try {
              await login(email, password);
              navigate(from, { replace: true });
            } catch (error) {
              if (isAxiosError(error)) {
                const apiMessage = error.response?.data?.message;
                if (typeof apiMessage === 'string' && apiMessage.length > 0) {
                  setError(apiMessage);
                  return;
                }
              }

              setError('Invalid credentials or unauthorized admin account.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-700 dark:text-primary-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-800 outline-none transition-colors focus:border-primary-400 dark:border-dark-600 dark:bg-dark-900 dark:text-primary-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-primary-700 dark:text-primary-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-800 outline-none transition-colors focus:border-primary-400 dark:border-dark-600 dark:bg-dark-900 dark:text-primary-100"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary-900 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-800 disabled:opacity-60 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-white"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
