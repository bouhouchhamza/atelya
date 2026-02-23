<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'slug',
        'description',
        'price',
        'image_url',
        'is_featured',
        'compare_at_price',
        'sku',
        'stock',
        'status',
        'category_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            if (blank($product->name) && filled($product->title)) {
                $product->name = $product->title;
            }

            if (blank($product->title) && filled($product->name)) {
                $product->title = $product->name;
            }

            if (blank($product->slug) && filled($product->name)) {
                $product->slug = Str::slug((string) $product->name);
            }
        });
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
