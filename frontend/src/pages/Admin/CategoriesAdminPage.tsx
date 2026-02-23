import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function CategoriesAdminPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories(1),
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.createCategory({ name, slug: slug || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      setSlug('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (id: number) => adminApi.updateCategory(id, { name, slug: slug || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setName('');
      setSlug('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const startEdit = (category: { id: number; name: string; slug: string }) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Category' : 'Create Category'}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input placeholder="Slug (optional)" value={slug} onChange={(event) => setSlug(event.target.value)} />
          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={!name || createMutation.isPending || updateMutation.isPending}
              onClick={() => (editingId ? updateMutation.mutate(editingId) : createMutation.mutate())}
            >
              {editingId ? 'Update' : 'Create'}
            </Button>
            {editingId ? (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setSlug('');
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Products</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading ? [] : data?.data ?? []).map((category) => (
                <tr key={category.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3">{category.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{category.slug}</td>
                  <td className="px-4 py-3">{category.products_count ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(category)}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (window.confirm('Delete this category?')) {
                            deleteMutation.mutate(category.id);
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
          {isLoading ? <p className="p-4 text-sm text-zinc-500">Loading categories...</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
