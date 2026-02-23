<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);
        $price = fake()->randomFloat(2, 39, 1299);
        $compareAt = fake()->boolean(35) ? $price + fake()->randomFloat(2, 10, 150) : null;

        return [
            'name' => Str::title($title),
            'title' => Str::title($title),
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(3),
            'price' => $price,
            'image_url' => fake()->optional(0.7)->imageUrl(720, 720, 'electronics'),
            'is_featured' => fake()->boolean(25),
            'compare_at_price' => $compareAt,
            'sku' => strtoupper(fake()->bothify('ATL-#####')),
            'stock' => fake()->numberBetween(0, 140),
            'status' => fake()->randomElement(['active', 'active', 'active', 'draft']),
            'category_id' => Category::factory(),
        ];
    }
}
