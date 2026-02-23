import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storefrontApi } from '../../lib/api/client';
import { buttonVariants } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../lib/utils';

export default function HomePage() {
  const { data: featuredProducts = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => storefrontApi.featured(8),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700 p-8 text-white shadow-xl dark:border-zinc-800">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300">ATELYA Electronics</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Premium Electronics Crafted For Everyday Performance
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-200">
          Explore curated products with modern design, reliable performance, and clean user experience.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/products" className={cn(buttonVariants({ size: 'lg' }))}>
            Shop Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            to="/products"
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'border-zinc-500 bg-white/10 text-white hover:bg-white/20'
            )}
          >
            Browse Catalog
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-72 animate-pulse bg-zinc-100 dark:bg-zinc-800" />
                  </CardContent>
                </Card>
              ))
            : featuredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={product.placeholder_image}
                      alt={product.title}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="space-y-2 p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold">{product.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">${product.price.toFixed(2)}</p>
                      <Link
                        to={`/products/${product.slug}`}
                        className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                      >
                        View Details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>
    </div>
  );
}
