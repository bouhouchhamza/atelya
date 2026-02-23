import axios from 'axios';
import { API_BASE_URL } from './baseUrl';
import type {
  AnalyticsOverview,
  ApiResponse,
  Category,
  Customer,
  Order,
  PaginatedResponse,
  Product,
  User,
} from './types';

export const api = axios.create({
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
});

async function ensureCsrfCookie() {
  await csrfClient.get('/sanctum/csrf-cookie');
}

export interface ProductListParams {
  search?: string;
  category_id?: number | null;
  sort?: 'created_at' | 'price' | 'title' | 'stock';
  direction?: 'asc' | 'desc';
  status?: 'draft' | 'active';
  page?: number;
  per_page?: number;
}

export const authApi = {
  async login(email: string, password: string) {
    await ensureCsrfCookie();
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/login', { email, password });
    return response.data.data.user;
  },
  async me() {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },
  async logout() {
    await api.post<ApiResponse<null>>('/auth/logout');
  },
};

export const storefrontApi = {
  async categories() {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  },
  async products(params: ProductListParams) {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },
  async featured(limit = 8) {
    const response = await api.get<ApiResponse<Product[]>>('/products/featured', { params: { limit } });
    return response.data.data;
  },
  async productBySlug(slug: string) {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}`);
    return response.data.data;
  },
  async createOrder(payload: {
    items: Array<{ product_id: number; qty: number }>;
    shipping?: number;
    tax?: number;
    currency?: string;
  }) {
    const response = await api.post<ApiResponse<Order>>('/orders', payload);
    return response.data.data;
  },
};

export const adminApi = {
  async analytics(range: '7d' | '30d' | '90d' = '30d') {
    const response = await api.get<ApiResponse<AnalyticsOverview>>('/admin/analytics/overview', {
      params: { range },
    });
    return response.data.data;
  },
  async categories(page = 1) {
    const response = await api.get<PaginatedResponse<Category>>('/admin/categories', {
      params: { page },
    });
    return response.data;
  },
  async createCategory(payload: { name: string; slug?: string }) {
    const response = await api.post<ApiResponse<Category>>('/admin/categories', payload);
    return response.data.data;
  },
  async updateCategory(id: number, payload: { name: string; slug?: string }) {
    const response = await api.put<ApiResponse<Category>>(`/admin/categories/${id}`, payload);
    return response.data.data;
  },
  async deleteCategory(id: number) {
    await api.delete(`/admin/categories/${id}`);
  },
  async products(params: ProductListParams) {
    const response = await api.get<PaginatedResponse<Product>>('/admin/products', { params });
    return response.data;
  },
  async createProduct(payload: {
    title: string;
    description: string;
    price: number;
    compare_at_price?: number | null;
    sku?: string | null;
    stock: number;
    status: 'draft' | 'active';
    category_id: number;
    slug?: string;
  }) {
    const response = await api.post<ApiResponse<Product>>('/admin/products', payload);
    return response.data.data;
  },
  async updateProduct(
    id: number,
    payload: {
      title: string;
      description: string;
      price: number;
      compare_at_price?: number | null;
      sku?: string | null;
      stock: number;
      status: 'draft' | 'active';
      category_id: number;
      slug?: string;
    }
  ) {
    const response = await api.put<ApiResponse<Product>>(`/admin/products/${id}`, payload);
    return response.data.data;
  },
  async deleteProduct(id: number) {
    await api.delete(`/admin/products/${id}`);
  },
  async orders(params: {
    status?: string;
    from?: string;
    to?: string;
    search?: string;
    page?: number;
  }) {
    const response = await api.get<PaginatedResponse<Order>>('/admin/orders', { params });
    return response.data;
  },
  async orderById(id: number) {
    const response = await api.get<ApiResponse<Order>>(`/admin/orders/${id}`);
    return response.data.data;
  },
  async updateOrderStatus(id: number, status: Order['status']) {
    const response = await api.patch<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status });
    return response.data.data;
  },
  async customers(page = 1) {
    const response = await api.get<PaginatedResponse<Customer>>('/admin/customers', { params: { page } });
    return response.data;
  },
};

export const analyticsApi = {
  async trackPageView(payload: { path: string; referrer?: string | null; device?: string; session_id: string }) {
    await api.post('/analytics/page-view', payload);
  },
  async trackEvent(payload: { type: string; payload?: Record<string, unknown>; session_id: string }) {
    await api.post('/analytics/event', payload);
  },
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Keep silent; route guards handle redirects.
    }
    return Promise.reject(error);
  }
);
