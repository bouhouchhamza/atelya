import axios from 'axios';
import { API_BASE_URL } from './api/baseUrl';

const API_PREFIX = '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith(API_PREFIX)) {
      config.url = `${API_PREFIX}${config.url.startsWith('/') ? config.url : `/${config.url}`}`;
    }

    // Add auth token if available
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export interface AdminAnalytics {
  range: { days: number; from: string; to: string };
  visitors: { total_visits: number; unique_visitors: number };
  sales: { total_orders: number; total_revenue: number };
  series: Array<{ date: string; visits: number; orders: number; revenue: number }>;
  top_products: Array<{ id: number; name: string; qty: number; revenue: number }>;
}

export async function getAdminAnalytics(days = 30): Promise<AdminAnalytics> {
  const response = await api.get('/admin/analytics/overview', { params: { days } });
  return (response as any).data ?? response;
}

import type { DashboardResponse } from './types/dashboard';
import type { Settings } from './types/settings';

export async function getAdminDashboard(days = 30): Promise<DashboardResponse> {
  const response = await api.get('/admin/dashboard', { params: { days } });
  return (response as any).data ?? response;
}

export async function getDashboardSettings(): Promise<Settings> {
  const response = await api.get('/admin/dashboard/settings');
  return (response as any).data ?? response;
}

export async function updateDashboardSettings(payload: Partial<Settings>): Promise<Settings> {
  const response = await api.put('/admin/dashboard/settings', payload);
  return (response as any).data ?? response;
}

export async function trackPageview(payload: { path: string; referrer?: string | null }) {
  try {
    await api.post('/track-visit', {
      path: payload.path,
      referrer: payload.referrer ?? null,
      session_id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    });
  } catch (error) {
    // non-blocking; ignore errors
  }
}

export async function getPublicSettings(): Promise<Settings> {
  const response = await api.get('/settings/public');
  return (response as any).data ?? response;
}

export async function getAdminSettings(): Promise<Settings> {
  const response = await api.get('/admin/settings');
  return (response as any).data ?? response;
}

export async function updateAdminSettings(payload: Settings): Promise<Settings> {
  const response = await api.put('/admin/settings', payload);
  return (response as any).data ?? response;
}

export async function uploadAdminFile(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  const response = await api.post('/admin/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return (response as any).data ?? response;
}
