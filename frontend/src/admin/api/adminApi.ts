import axios from 'axios';
import { API_BASE_URL } from '../../lib/api/baseUrl';

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  featured: boolean;
  created_at: string | null;
}

export interface AdminStats {
  total_orders: number;
  total_products: number;
  total_categories: number;
  featured_products: number;
  revenue: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
}

interface ProductPayload {
  name: string;
  description: string;
  price: number;
  image_url: string;
  featured: boolean;
}

interface CategoryPayload {
  name: string;
  slug?: string;
}

interface ApiEnvelope<T> {
  message: string;
  data: T;
}

interface PaginatedApiEnvelope<T> extends ApiEnvelope<T> {
  meta: PaginationMeta;
}

const adminClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const adminApi = {
  async stats(): Promise<AdminStats> {
    const response = await adminClient.get<ApiEnvelope<AdminStats>>('/admin/stats');
    return response.data.data;
  },

  async listProducts(params: { page?: number; search?: string; per_page?: number }) {
    const response = await adminClient.get<PaginatedApiEnvelope<AdminProduct[]>>('/admin/products', { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async getProduct(id: number): Promise<AdminProduct> {
    const response = await adminClient.get<ApiEnvelope<AdminProduct>>(`/admin/products/${id}`);
    return response.data.data;
  },

  async createProduct(payload: ProductPayload): Promise<AdminProduct> {
    const response = await adminClient.post<ApiEnvelope<AdminProduct>>('/admin/products', payload);
    return response.data.data;
  },

  async updateProduct(id: number, payload: ProductPayload): Promise<AdminProduct> {
    const response = await adminClient.put<ApiEnvelope<AdminProduct>>(`/admin/products/${id}`, payload);
    return response.data.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await adminClient.delete(`/admin/products/${id}`);
  },

  async categories(): Promise<AdminCategory[]> {
    const response = await adminClient.get<PaginatedApiEnvelope<AdminCategory[]>>('/admin/categories');
    return response.data.data;
  },

  async createCategory(payload: CategoryPayload): Promise<AdminCategory> {
    const response = await adminClient.post<ApiEnvelope<AdminCategory>>('/admin/categories', payload);
    return response.data.data;
  },

  async updateCategory(id: number, payload: CategoryPayload): Promise<AdminCategory> {
    const response = await adminClient.put<ApiEnvelope<AdminCategory>>(`/admin/categories/${id}`, payload);
    return response.data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await adminClient.delete(`/admin/categories/${id}`);
  },

  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await adminClient.post<ApiEnvelope<{ path: string; url: string }>>(
      '/admin/uploads/products',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.url;
  },
};
