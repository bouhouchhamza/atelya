<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductCrudController extends BaseApiController
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Product::query();

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $paginator = $query
            ->latest()
            ->paginate($validated['per_page'] ?? 10)
            ->withQueryString();

        $items = collect($paginator->items())
            ->map(fn (Product $product) => $this->transformProduct($product))
            ->all();

        return response()->json([
            'message' => 'Admin products retrieved successfully.',
            'data' => $items,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);
        $defaultCategoryId = $this->resolveDefaultCategoryId();
        $name = trim($validated['name']);

        $product = Product::query()->create([
            'name' => $name,
            'title' => $name,
            'slug' => $this->generateUniqueSlug($name),
            'description' => $validated['description'] ?? '',
            'price' => $validated['price'],
            'image_url' => $validated['image_url'] ?? null,
            'is_featured' => $validated['featured'] ?? false,
            'status' => 'active',
            'stock' => 100,
            'category_id' => $defaultCategoryId,
        ]);

        return $this->success(
            $this->transformProduct($product),
            'Admin product created successfully.',
            201
        );
    }

    public function show(Product $product)
    {
        return $this->success(
            $this->transformProduct($product),
            'Admin product retrieved successfully.'
        );
    }

    public function update(Request $request, Product $product)
    {
        $validated = $this->validatePayload($request);
        $name = trim($validated['name']);

        $product->update([
            'name' => $name,
            'title' => $name,
            'slug' => $this->generateUniqueSlug($name, $product->id),
            'description' => $validated['description'] ?? '',
            'price' => $validated['price'],
            'image_url' => $validated['image_url'] ?? null,
            'is_featured' => $validated['featured'] ?? false,
        ]);

        return $this->success(
            $this->transformProduct($product->fresh()),
            'Admin product updated successfully.'
        );
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return $this->success(null, 'Admin product deleted successfully.');
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'featured' => ['nullable', 'boolean'],
        ]);
    }

    private function resolveDefaultCategoryId(): int
    {
        $category = Category::query()->first();

        if ($category) {
            return $category->id;
        }

        return Category::query()->create([
            'name' => 'General',
            'slug' => 'general',
        ])->id;
    }

    private function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Product::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    private function transformProduct(Product $product): array
    {
        $name = $product->name ?: $product->title;

        return [
            'id' => $product->id,
            'name' => $name,
            'description' => $product->description ?? '',
            'price' => (float) $product->price,
            'image_url' => $product->image_url,
            'featured' => (bool) $product->is_featured,
            'created_at' => $product->created_at?->toISOString(),
        ];
    }
}
