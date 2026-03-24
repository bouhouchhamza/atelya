export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  categoryName: string;
  featured: boolean;
  stock: number;
  benefits: string[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "guest" | "customer" | "admin";
  totalSpent?: number;
  orderCount?: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  country: string;
  line1: string;
  line2?: string;
  postalCode: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  address: Address;
}

export interface WishlistItem {
  id: string;
  productId: string;
}

export interface PublicSettings {
  storeName: string;
  heroTitle: string;
  heroSubtitle: string;
  supportEmail: string;
  currency: string;
  brandTagline: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  activeProducts: number;
  lowStockAlerts: number;
}

export interface AnalyticsSummary {
  visits: number;
  conversionRate: number;
  salesByMonth: { month: string; revenue: number }[];
  topProducts: { id: string; name: string; salesCount: number; revenue: number }[];
}
