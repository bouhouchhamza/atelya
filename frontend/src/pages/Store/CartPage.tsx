import { Link } from 'react-router-dom';
import { useCart } from '../../app/providers/CartProvider';
import { Button, buttonVariants } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { cn } from '../../lib/utils';

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500">Your cart is empty.</p>
          <Link to="/products" className={cn(buttonVariants({ className: 'mt-4 inline-flex' }))}>
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center"
              >
                <img src={item.placeholder_image} alt={item.title} className="h-24 w-24 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(event) => updateQty(item.product_id, Number(event.target.value))}
                    className="w-20"
                  />
                  <Button variant="outline" size="sm" onClick={() => removeItem(item.product_id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <Link to="/checkout" className={cn(buttonVariants({ className: 'mt-4 w-full' }))}>
              Continue to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
