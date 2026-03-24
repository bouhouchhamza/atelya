import axios from "axios";
import {
  Product,
  Category,
  Customer,
  Order,
  Address,
  WishlistItem,
  PublicSettings,
  AdminStats,
  AnalyticsSummary,
  ApiResponse,
} from "@/types";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // PUBLIC
  getCategories: () => apiClient.get<ApiResponse<Category[]>>("/categories").then(res => res.data.data!),
  getProducts: () => apiClient.get<ApiResponse<Product[]>>("/products").then(res => res.data.data!),
  getFeaturedProducts: () => apiClient.get<ApiResponse<Product[]>>("/products/featured").then(res => res.data.data!),
  getProductBySlug: (slug: string) => apiClient.get<ApiResponse<Product>>(`/products/${slug}`).then(res => res.data.data!),
  getSettings: () => apiClient.get<ApiResponse<PublicSettings>>("/settings/public").then(res => res.data.data!),
  createOrder: (payload: any) => apiClient.post<ApiResponse<Order>>("/orders", payload).then(res => res.data.data!),

  // CUSTOMER
  getCustomerProfile: () => apiClient.get<ApiResponse<Customer>>("/customer/profile").then(res => res.data.data!),
  updateCustomerProfile: (data: Partial<Customer>) => apiClient.put<ApiResponse<Customer>>("/customer/profile", data).then(res => res.data.data!),
  getCustomerOrders: () => apiClient.get<ApiResponse<Order[]>>("/customer/orders").then(res => res.data.data!),
  getCustomerOrderById: (id: string) => apiClient.get<ApiResponse<Order>>(`/customer/orders/${id}`).then(res => res.data.data!),
  getCustomerAddresses: () => apiClient.get<ApiResponse<Address[]>>("/customer/addresses").then(res => res.data.data!),
  createCustomerAddress: (data: Partial<Address>) => apiClient.post<ApiResponse<Address>>("/customer/addresses", data).then(res => res.data.data!),
  deleteCustomerAddress: (id: string) => apiClient.delete(`/customer/addresses/${id}`),
  getWishlist: () => apiClient.get<ApiResponse<WishlistItem[]>>("/customer/wishlist").then(res => res.data.data!),

  // ADMIN — Read
  getAdminStats: () => apiClient.get<ApiResponse<AdminStats>>("/admin/stats").then(res => res.data.data!),
  getAdminProducts: () => apiClient.get<ApiResponse<Product[]>>("/admin/products").then(res => res.data.data!),
  getAdminOrders: () => apiClient.get<ApiResponse<Order[]>>("/admin/orders").then(res => res.data.data!),
  getAdminCustomers: () => apiClient.get<ApiResponse<Customer[]>>("/admin/customers").then(res => res.data.data!),
  getAdminAnalytics: () => apiClient.get<ApiResponse<AnalyticsSummary>>("/admin/analytics").then(res => res.data.data!),
  getAdminCategories: () => apiClient.get<ApiResponse<Category[]>>("/admin/categories").then(res => res.data.data!),
  getAdminSettings: () => apiClient.get<ApiResponse<PublicSettings>>("/admin/settings").then(res => res.data.data!),

  // ADMIN — Mutations
  createProduct: (data: Partial<Product>) => apiClient.post<ApiResponse<Product>>("/admin/products", data).then(res => res.data.data!),
  createCategory: (data: Partial<Category>) => apiClient.post<ApiResponse<Category>>("/admin/categories", data).then(res => res.data.data!),
  updateSettings: (data: Partial<PublicSettings>) => apiClient.put<ApiResponse<PublicSettings>>("/admin/settings", data).then(res => res.data.data!),
};
