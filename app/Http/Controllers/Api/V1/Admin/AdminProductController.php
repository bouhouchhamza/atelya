<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Api\V1\Admin\StoreProductRequest;
use App\Http\Requests\Api\V1\Admin\UpdateProductRequest;
use App\Http\Resources\Api\V1\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminProductController extends BaseApiController
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'status' => ['nullable', Rule::in(['draft', 'active'])],
            'sort' => ['nullable', Rule::in(['created_at', 'price', 'stock', 'title'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Product::query()->with('category');

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (! empty($validated['category_id'])) {
            $query->where('category_id', $validated['category_id']);
        }

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 12;

        $paginator = $query
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return $this->paginated(
            $paginator,
            ProductResource::collection($paginator),
            'Products retrieved successfully.'
        );
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        $baseSlug = $data['slug'] ?? Str::slug($data['title']);

        $product = Product::query()->create([
            ...$data,
            'slug' => $this->generateUniqueSlug($baseSlug),
        ]);

        return $this->success(
            ProductResource::make($product->load('category')),
            'Product created successfully.',
            201
        );
    }

    public function show(Product $product)
    {
        return $this->success(
            ProductResource::make($product->load('category')),
            'Product retrieved successfully.'
        );
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $baseSlug = $data['slug'] ?? Str::slug($data['title']);

        $product->update([
            ...$data,
            'slug' => $this->generateUniqueSlug($baseSlug, $product->id),
        ]);

        return $this->success(
            ProductResource::make($product->load('category')),
            'Product updated successfully.'
        );
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return $this->success(null, 'Product deleted successfully.');
    }

    private function generateUniqueSlug(string $baseSlug, ?int $ignoreId = null): string
    {
        $slug = Str::slug($baseSlug);
        $counter = 1;

        while (
            Product::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = Str::slug($baseSlug) . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
