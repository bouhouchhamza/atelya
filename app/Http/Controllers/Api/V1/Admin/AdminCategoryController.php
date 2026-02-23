<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Api\V1\Admin\StoreCategoryRequest;
use App\Http\Requests\Api\V1\Admin\UpdateCategoryRequest;
use App\Http\Resources\Api\V1\CategoryResource;
use App\Models\Category;
use Illuminate\Support\Str;

class AdminCategoryController extends BaseApiController
{
    public function index()
    {
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return $this->paginated(
            $categories,
            CategoryResource::collection($categories),
            'Categories retrieved successfully.'
        );
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $baseSlug = $data['slug'] ?? Str::slug($data['name']);

        $category = Category::query()->create([
            'name' => $data['name'],
            'slug' => $this->generateUniqueSlug($baseSlug),
        ]);

        return $this->success(
            CategoryResource::make($category->loadCount('products')),
            'Category created successfully.',
            201
        );
    }

    public function show(Category $category)
    {
        return $this->success(
            CategoryResource::make($category->loadCount('products')),
            'Category retrieved successfully.'
        );
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $data = $request->validated();
        $baseSlug = $data['slug'] ?? Str::slug($data['name']);

        $category->update([
            'name' => $data['name'],
            'slug' => $this->generateUniqueSlug($baseSlug, $category->id),
        ]);

        return $this->success(
            CategoryResource::make($category->loadCount('products')),
            'Category updated successfully.'
        );
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category with products.',
                'errors' => [],
            ], 422);
        }

        $category->delete();

        return $this->success(null, 'Category deleted successfully.');
    }

    private function generateUniqueSlug(string $baseSlug, ?int $ignoreId = null): string
    {
        $slug = Str::slug($baseSlug);
        $counter = 1;

        while (
            Category::query()
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
