import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => adminApi.listProducts({ page, search, per_page: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] }),
      ]);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900 dark:text-primary-100">Products</h1>
          <p className="text-sm text-primary-600 dark:text-primary-400">Manage catalog items</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex h-10 items-center rounded-xl bg-primary-900 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-800 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-white"
        >
          New Product
        </Link>
      </div>

      <div className="rounded-2xl border border-primary-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-900">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-800 outline-none focus:border-primary-400 dark:border-dark-600 dark:bg-dark-800 dark:text-primary-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <table className="w-full text-sm">
          <thead className="bg-primary-100/70 dark:bg-dark-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-primary-700 dark:text-primary-300">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-primary-700 dark:text-primary-300">Price</th>
              <th className="px-4 py-3 text-left font-semibold text-primary-700 dark:text-primary-300">Featured</th>
              <th className="px-4 py-3 text-right font-semibold text-primary-700 dark:text-primary-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data?.data ?? []).map((product) => (
              <tr key={product.id} className="border-t border-primary-100 dark:border-dark-700">
                <td className="px-4 py-3 text-primary-900 dark:text-primary-100">{product.name}</td>
                <td className="px-4 py-3 text-primary-800 dark:text-primary-200">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-primary-700 dark:text-primary-300">{product.featured ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-dark-600 dark:text-primary-300 dark:hover:bg-dark-700"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                      onClick={() => {
                        if (window.confirm('Delete this product?')) {
                          deleteMutation.mutate(product.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading ? (
          <p className="p-4 text-sm text-primary-600 dark:text-primary-400">Loading products...</p>
        ) : null}
      </div>

      {data?.meta ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-primary-600 dark:text-primary-400">
            Page {data.meta.current_page} of {data.meta.last_page} ({data.meta.total} items)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-medium text-primary-700 disabled:opacity-50 dark:border-dark-600 dark:text-primary-300"
              disabled={data.meta.current_page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-medium text-primary-700 disabled:opacity-50 dark:border-dark-600 dark:text-primary-300"
              disabled={data.meta.current_page >= data.meta.last_page}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
