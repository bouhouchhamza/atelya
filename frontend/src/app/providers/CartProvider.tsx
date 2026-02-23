import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../../lib/api/types';

export interface CartItem {
  product_id: number;
  title: string;
  price: number;
  qty: number;
  placeholder_image: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  updateQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = 'atelya-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, qty = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product_id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product_id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }

      return [
        ...current,
        {
          product_id: product.id,
          title: product.title,
          price: product.price,
          qty,
          placeholder_image: product.placeholder_image,
        },
      ];
    });
  };

  const updateQty = (productId: number, qty: number) => {
    setItems((current) =>
      current
        .map((item) => (item.product_id === productId ? { ...item, qty: Math.max(1, qty) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (productId: number) => {
    setItems((current) => current.filter((item) => item.product_id !== productId));
  };

  const clear = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  const value = useMemo(
    () => ({ items, addItem, updateQty, removeItem, clear, subtotal, count }),
    [items, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
