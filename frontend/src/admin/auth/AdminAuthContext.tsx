import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../lib/api/baseUrl';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthEnvelope {
  data: {
    user: AdminUser;
  };
}

interface MeEnvelope {
  data: AdminUser;
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const STORAGE_KEY = 'atelya-admin-auth';

const authClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const csrfClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
});

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const shouldCheckSession = localStorage.getItem(STORAGE_KEY) === '1';
      if (!shouldCheckSession) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await authClient.get<MeEnvelope>('/auth/me');
      const currentUser = response.data.data;

      if (currentUser.role !== 'admin') {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      } else {
        setUser(currentUser);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    await csrfClient.get('/sanctum/csrf-cookie');
    const response = await authClient.post<AuthEnvelope>('/auth/login', { email, password });
    const currentUser = response.data.data.user;

    if (currentUser.role !== 'admin') {
      throw new Error('Admin access is required.');
    }

    localStorage.setItem(STORAGE_KEY, '1');
    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authClient.post('/auth/logout');
    } catch {
      // no-op; clear local state regardless
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
