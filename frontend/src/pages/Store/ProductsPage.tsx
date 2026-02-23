import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { storefrontApi } from '../../lib/api/client';
import { useCart } from '../../app/providers/CartProvider';
import { Button, buttonVariants } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../lib/utils';

export default function ProductsPage() {
  const { addItem } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const page = Number(searchParams.get('page') ?? '1');
  const sort = (searchParams.get('sort') ?? 'created_at') as 'created_at' | 'price';
  const direction = (searchParams.get('direction') ?? 'desc') as 'asc' | 'desc';
  const categoryId = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : null;
  const search = searchParams.get('search') ?? '';

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: storefrontApi.categories,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, sort, direction, categoryId, search }],
    queryFn: () =>
      storefrontApi.products({
        page,
        per_page: 12,
        sort,
        direction,
        category_id: categoryId,
        search,
      }),
  });

  const setParams = (next: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    if (next.search !== undefined || next.category_id !== undefined || next.sort !== undefined || next.direction !== undefined) {
      params.set('page', '1');
    }
    setSearchParams(params);
  };

  const title = useMemo(() => {
    if (categoryId) {
      const category = categories.find((item) => item.id === categoryId);
      return category ? `${category.name} Products` : 'Products';
    }
    return 'All Products';
  }, [categories, categoryId]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Browse and compare products with real-time availability.</p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setParams({ search: searchInput });
          }}
          className="md:col-span-2"
        >
          <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search products..." />
        </form>

        <select
          className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          value={categoryId ?? ''}
          onChange={(event) => setParams({ category_id: event.target.value || null })}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          value={`${sort}:${direction}`}
          onChange={(event) => {
            const [nextSort, nextDirection] = event.target.value.split(':');
            setParams({ sort: nextSort, direction: nextDirection });
          }}
        >
          <option value="created_at:desc">Newest</option>
          <option value="price:asc">Price: Low to High</option>
          <option value="price:desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-72 animate-pulse bg-zinc-100 dark:bg-zinc-800" />
                </CardContent>
              </Card>
            ))
          : (data?.data ?? []).map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={product.placeholder_image}
                    alt={product.title}
                    className="h-52 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="space-y-2 p-4">
                    <Link to={`/products/${product.slug}`} className="line-clamp-2 text-sm font-semibold hover:underline">
                      {product.title}
                    </Link>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{product.category?.name}</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${product.price.toFixed(2)}</p>
                    <Button size="sm" className="w-full" onClick={() => addItem(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {data?.meta ? (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {data.meta.current_page} of {data.meta.last_page}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              onClick={() => setParams({ page: String(Math.max(1, page - 1)) })}
              disabled={page <= 1}
            >
              Previous
            </button>
            <button
              type="button"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              onClick={() => setParams({ page: String(Math.min(data.meta.last_page, page + 1)) })}
              disabled={page >= data.meta.last_page}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
