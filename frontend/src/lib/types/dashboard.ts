export interface DashboardResponse {
  stats: {
    total_orders: number;
    total_products: number;
    featured_products: number;
    revenue: number;
  };
  visitors: {
    today: number;
    last_7_days: number;
    last_30_days: number;
    unique: number;
  };
  charts: {
    labels: string[];
    orders: number[];
    revenue: number[];
    visits: number[];
  };
  topProducts: Array<{
    id: number;
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: number;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
}
