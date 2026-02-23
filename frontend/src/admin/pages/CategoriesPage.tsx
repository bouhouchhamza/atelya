import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

interface CategoryFormState {
  id?: number;
  name: string;
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<CategoryFormState>({ name: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminApi.categories,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: CategoryFormState) => {
      if (payload.id) {
        return adminApi.updateCategory(payload.id, { name: payload.name });
      }
      return adminApi.createCategory({ name: payload.name });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsModalOpen(false);
      setForm({ name: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const filteredCategories = useMemo(
    () =>
      (data ?? []).filter((category) =>
        category.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [data, search]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900 dark:text-primary-100">Categories</h1>
          <p className="text-sm text-primary-600 dark:text-primary-400">
            Create and manage product categories.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center rounded-xl bg-primary-900 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-800 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-white"
          onClick={() => {
            setForm({ name: '' });
            setIsModalOpen(true);
          }}
        >
          New Category
        </button>
      </div>

      <div className="rounded-2xl border border-primary-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-900">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories..."
          className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-800 outline-none transition-colors focus:border-primary-400 dark:border-dark-600 dark:bg-dark-800 dark:text-primary-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        {isLoading ? (
          <p className="p-5 text-sm text-primary-600 dark:text-primary-400">Loading categories...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-primary-100/70 dark:bg-dark-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-primary-700 dark:text-primary-300">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-primary-700 dark:text-primary-300">Slug</th>
                <th className="px-4 py-3 text-right font-semibold text-primary-700 dark:text-primary-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-t border-primary-100 dark:border-dark-700">
                  <td className="px-4 py-3 text-primary-900 dark:text-primary-100">{category.name}</td>
                  <td className="px-4 py-3 text-primary-700 dark:text-primary-300">{category.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-primary-200 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-dark-600 dark:text-primary-300 dark:hover:bg-dark-700"
                        onClick={() => {
                          setForm({ id: category.id, name: category.name });
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                        onClick={() => {
                          if (window.confirm('Delete this category?')) {
                            deleteMutation.mutate(category.id);
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
        )}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4">
          <form
            className="w-full max-w-md rounded-2xl border border-primary-200 bg-white p-5 shadow-xl dark:border-dark-700 dark:bg-dark-900"
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate(form);
            }}
          >
            <h2 className="text-lg font-semibold text-primary-900 dark:text-primary-100">
              {form.id ? 'Edit Category' : 'Create Category'}
            </h2>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-primary-700 dark:text-primary-300">Name</label>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-800 outline-none transition-colors focus:border-primary-400 dark:border-dark-600 dark:bg-dark-800 dark:text-primary-100"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-primary-200 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-dark-600 dark:text-primary-300 dark:hover:bg-dark-700"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="rounded-xl bg-primary-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800 disabled:opacity-60 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-white"
              >
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
