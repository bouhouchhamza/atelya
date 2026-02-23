export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  stock: number;
  status: 'active' | 'inactive';
  category_id: number;
  image: string;
  images?: string[];
  featured: boolean;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ProductFilters {
  category_id?: number;
  search?: string;
  sort?: string;
  direction?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
