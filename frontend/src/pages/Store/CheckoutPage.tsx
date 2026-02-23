import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../app/providers/CartProvider';
import { storefrontApi } from '../../lib/api/client';
import { getSessionIdForAnalytics } from '../../hooks/usePageViewTracking';
import { analyticsApi } from '../../lib/api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
  });
  const shipping = useMemo(() => (subtotal >= 200 ? 0 : 12), [subtotal]);
  const tax = useMemo(() => Number((subtotal * 0.08).toFixed(2)), [subtotal]);

  const mutation = useMutation({
    mutationFn: () =>
      storefrontApi.createOrder({
        items: items.map((item) => ({ product_id: item.product_id, qty: item.qty })),
        shipping,
        tax,
        currency: 'USD',
      }),
    onSuccess: async (order) => {
      clear();
      await analyticsApi.trackEvent({
        type: 'purchase',
        payload: { order_number: order.order_number, total: order.total },
        session_id: getSessionIdForAnalytics(),
      });
      navigate('/products');
    },
  });

  if (items.length === 0) {
    return <div className="mx-auto max-w-6xl px-4 py-12">Your cart is empty.</div>;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
      <form
        className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <Input
          placeholder="Full name"
          value={form.fullName}
          onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
        <Input
          placeholder="Shipping address"
          value={form.address}
          onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
          required
        />
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? 'Placing order...' : 'Place order'}
        </Button>
      </form>

      <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 font-semibold dark:border-zinc-800">
            <span>Total</span>
            <span>${(subtotal + shipping + tax).toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
