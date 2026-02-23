<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Product */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $name = $this->name ?? $this->title;
        $imageUrl = $this->image_url ?: sprintf('https://placehold.co/720x720?text=%s', urlencode($name));

        return [
            'id' => $this->id,
            'name' => $name,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'image_url' => $this->image_url,
            'image' => $imageUrl,
            'featured' => (bool) $this->is_featured,
            'is_featured' => (bool) $this->is_featured,
            'compare_at_price' => $this->compare_at_price !== null ? (float) $this->compare_at_price : null,
            'sku' => $this->sku,
            'stock' => $this->stock,
            'status' => $this->status,
            'category_id' => $this->category_id,
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'placeholder_image' => $imageUrl,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
