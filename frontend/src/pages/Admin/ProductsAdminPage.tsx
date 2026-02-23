import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, storefrontApi } from '../../lib/api/client';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

type ProductForm = {
  id?: number;
  title: string;
  description: string;
  price: string;
  compare_at_price: string;
  sku: string;
  stock: string;
  status: 'draft' | 'active';
  category_id: string;
};

const emptyForm: ProductForm = {
  title: '',
  description: '',
  price: '',
  compare_at_price: '',
  sku: '',
  stock: '',
  status: 'active',
  category_id: '',
};

export default function ProductsAdminPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'draft' | 'active'>('all');
  const [sort, setSort] = useState<'created_at' | 'price' | 'stock' | 'title'>('created_at');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const { data: categories } = useQuery({
    queryKey: ['categories-all'],
    queryFn: storefrontApi.categories,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', { page, search, status, sort, direction }],
    queryFn: () =>
      adminApi.products({
        page,
        per_page: 10,
        search: search || undefined,
        status: status === 'all' ? undefined : status,
        sort,
        direction,
      }),
  });

  const upsertMutation = useMutation({
    mutationFn: async (payload: ProductForm) => {
      const request = {
        title: payload.title,
        description: payload.description,
        price: Number(payload.price),
        compare_at_price: payload.compare_at_price ? Number(payload.compare_at_price) : null,
        sku: payload.sku || null,
        stock: Number(payload.stock),
        status: payload.status,
        category_id: Number(payload.category_id),
      };

      if (payload.id) {
        return adminApi.updateProduct(payload.id, request);
      }
      return adminApi.createProduct(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      setIsModalOpen(false);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;
  const modalTitle = useMemo(() => (form.id ? 'Edit Product' : 'Add Product'), [form.id]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Button
          onClick={() => {
            setForm(emptyForm);
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <Input
            placeholder="Search by title, SKU..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="md:col-span-2"
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as 'all' | 'draft' | 'active');
              setPage(1);
            }}
            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as 'created_at' | 'price' | 'stock' | 'title')}
            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="created_at">Created At</option>
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
          <select
            value={direction}
            onChange={(event) => setDirection(event.target.value as 'asc' | 'desc')}
            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[780px] text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Stock</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading ? [] : products).map((product) => (
                <tr key={product.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.title}</p>
                    <p className="text-xs text-zinc-500">{product.sku ?? 'No SKU'}</p>
                  </td>
                  <td className="px-4 py-3">{product.category?.name}</td>
                  <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>{product.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setForm({
                            id: product.id,
                            title: product.title,
                            description: product.description,
                            price: String(product.price),
                            compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
                            sku: product.sku ?? '',
                            stock: String(product.stock),
                            status: product.status,
                            category_id: String(product.category_id),
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (window.confirm('Delete this product?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading ? <div className="p-4 text-sm text-zinc-500">Loading products...</div> : null}
        </CardContent>
      </Card>

      {meta ? (
        <div className="flex items-center justify-between text-sm">
          <p className="text-zinc-500">
            Page {meta.current_page} of {meta.last_page} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={meta.current_page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((current) => Math.min(meta.last_page, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">{modalTitle}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Input placeholder="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
              <Input placeholder="SKU" value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
              <Input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              />
              <Input
                placeholder="Compare at price"
                type="number"
                value={form.compare_at_price}
                onChange={(event) => setForm((current) => ({ ...current, compare_at_price: event.target.value }))}
              />
              <Input
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
              />
              <select
                className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as 'draft' | 'active' }))}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
              <select
                className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900 md:col-span-2"
                value={form.category_id}
                onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
              >
                <option value="">Select category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 md:col-span-2"
                placeholder="Description"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={upsertMutation.isPending}
                onClick={() => {
                  upsertMutation.mutate(form);
                }}
              >
                {upsertMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
