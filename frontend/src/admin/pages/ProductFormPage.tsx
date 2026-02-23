import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  image_url: string;
  featured: boolean;
}

const initialForm: ProductFormState = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  featured: false,
};

export default function ProductFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const editingId = id ? Number(id) : null;

  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ['admin-product', editingId],
    queryFn: () => adminApi.getProduct(editingId as number),
    enabled: Boolean(editingId),
  });

  useEffect(() => {
    if (!product) {
      return;
    }

    setForm({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      image_url: product.image_url ?? '',
      featured: product.featured,
    });
  }, [product]);

  const saveMutation = useMutation({
    mutationFn: async (payload: ProductFormState) => {
      const request = {
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        image_url: payload.image_url,
        featured: payload.featured,
      };

      if (editingId) {
        return adminApi.updateProduct(editingId, request);
      }
      return adminApi.createProduct(request);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] }),
      ]);
      navigate('/admin/products');
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900 dark:text-primary-100">
            {editingId ? 'Edit Product' : 'Create Product'}
          </h1>
          <p className="text-sm text-primary-600 dark:text-primary-400">
            Fill in product details for your catalog.
          </p>
        </div>
        <Link
          to="/admin/products"
          className="rounded-xl border border-primary-200 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-dark-600 dark:text-primary-300 dark:hover:bg-dark-700"
        >
          Back
        </Link>
      </div>

      {loadingProduct ? <p className="text-sm text-primary-600 dark:text-primary-400">Loading product...</p> : null}

      <form
        className="space-y-4 rounded-2xl border border-primary-200 bg-white p-5 dark:border-dark-700 dark:bg-dark-900"
        onSubmit={(event) => {
          event.preventDefault();
          saveMutation.mutate(form);
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-primary-700 dark:text-primary-300">Name</label>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-800 outline-none focus:border-primary-400 dark:border-dark-600 dark:bg-dark-800 dark:text-primary-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-primary-700 dark:text-primary-300">Description</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={4}
            className="w-full rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm text-primary-800 outline-none focus:border-primary-400 dark:border-dark-600 dark:bg-dark-800 dark:text-primary-100"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-700 dark:text-primary-300">Price</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-800 outline-none focus:border-primary-400 dark:border-dark-600 dark:bg-dark-800 dark:text-primary-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-700 dark:text-primary-300">Image URL</label>
            <input
              value={form.image_url}
              onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))}
              className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-800 outline-none focus:border-primary-400 dark:border-dark-600 dark:bg-dark-800 dark:text-primary-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-primary-700 dark:text-primary-300">Upload Image</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="block w-full cursor-pointer rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm text-primary-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-800 dark:border-dark-600 dark:bg-dark-800 dark:text-primary-200 dark:file:bg-dark-700 dark:file:text-primary-200"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }

              try {
                setUploadingImage(true);
                const uploadedUrl = await adminApi.uploadProductImage(file);
                setForm((current) => ({ ...current, image_url: uploadedUrl }));
              } finally {
                setUploadingImage(false);
              }
            }}
          />
          {uploadingImage ? (
            <p className="mt-2 text-xs text-primary-600 dark:text-primary-400">Uploading image...</p>
          ) : null}
          {form.image_url ? (
            <img
              src={form.image_url}
              alt="Product preview"
              loading="lazy"
              decoding="async"
              className="mt-3 h-20 w-20 rounded-xl border border-primary-200 object-cover dark:border-dark-700"
            />
          ) : null}
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
            className="h-4 w-4 rounded border-primary-300 text-primary-700 focus:ring-primary-500"
          />
          Featured product
        </label>

        <div className="flex justify-end gap-2">
          <Link
            to="/admin/products"
            className="rounded-xl border border-primary-200 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-dark-600 dark:text-primary-300 dark:hover:bg-dark-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-xl bg-primary-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800 disabled:opacity-60 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-white"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
