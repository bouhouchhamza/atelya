import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { storefrontApi } from '../../lib/api/client';
import { useCart } from '../../app/providers/CartProvider';
import { Button, buttonVariants } from '../../components/ui/button';
import { cn } from '../../lib/utils';

export default function ProductDetailsPage() {
  const { slug = '' } = useParams();
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => storefrontApi.productBySlug(slug),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-12">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-sm text-zinc-500">Product not found.</p>
        <Link to="/products" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 inline-flex')}>
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <img src={product.placeholder_image} alt={product.title} className="h-full w-full rounded-2xl border border-zinc-200 object-cover dark:border-zinc-800" />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{product.category?.name}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.title}</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">{product.description}</p>
        <div className="mt-6 flex items-center gap-3">
          <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
          {product.compare_at_price ? (
            <p className="text-sm text-zinc-500 line-through">${product.compare_at_price.toFixed(2)}</p>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-zinc-500">Stock: {product.stock}</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => addItem(product)}>Add to Cart</Button>
          <Link to="/cart" className={cn(buttonVariants({ variant: 'outline' }))}>
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
