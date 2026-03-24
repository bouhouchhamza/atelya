/**
 * In-memory mutable data store.
 * All API routes read/write from these arrays so that changes
 * persist for the lifetime of the dev-server process.
 */
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
} from "@/types";
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_CUSTOMERS,
  MOCK_ORDERS,
  MOCK_ADDRESSES,
  MOCK_WISHLIST,
  MOCK_SETTINGS,
  MOCK_ADMIN_STATS,
  MOCK_ANALYTICS,
} from "./mock-data";

class Store {
  products: Product[] = [...MOCK_PRODUCTS];
  categories: Category[] = [...MOCK_CATEGORIES];
  customers: Customer[] = [...MOCK_CUSTOMERS];
  orders: Order[] = [...MOCK_ORDERS];
  addresses: Address[] = [...MOCK_ADDRESSES];
  wishlist: WishlistItem[] = [...MOCK_WISHLIST];
  settings: PublicSettings = { ...MOCK_SETTINGS };
  adminStats: AdminStats = { ...MOCK_ADMIN_STATS };
  analytics: AnalyticsSummary = { ...MOCK_ANALYTICS };
}

// Singleton — survives hot-module reloads in dev
const globalForStore = globalThis as unknown as { __store?: Store };
export const store = globalForStore.__store ?? new Store();
globalForStore.__store = store;
