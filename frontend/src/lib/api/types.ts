export type UserRole = 'admin' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
  created_at?: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock: number;
  status: 'draft' | 'active';
  category_id: number;
  category?: Category;
  placeholder_image: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  title_snapshot: string;
  price_snapshot: number;
  unit_price?: number;
  qty: number;
  line_total: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  customer_name?: string | null;
  customer_email?: string | null;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  items?: OrderItem[];
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  orders_count: number;
  total_spent: number;
  created_at: string;
}

export interface AnalyticsPoint {
  date: string;
  value: number;
}

export interface AnalyticsOverview {
  total_revenue: number;
  total_orders: number;
  aov: number;
  revenue_by_day: AnalyticsPoint[];
  orders_by_day: AnalyticsPoint[];
  kpis: {
    revenue: number;
    orders: number;
    visitors: number;
    conversion_rate: number;
    aov: number;
  };
  series: {
    revenue: AnalyticsPoint[];
    visitors: AnalyticsPoint[];
    orders: AnalyticsPoint[];
  };
  top_products: Array<{
    id: number;
    title: string;
    revenue: number;
    units: number;
  }>;
  low_stock: Array<{
    id: number;
    title: string;
    stock: number;
  }>;
  recent_orders: Array<{
    id: number;
    order_number: string;
    total: number;
    status: Order['status'];
    created_at: string;
  }>;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginatedMeta;
}
