<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Audio', 'slug' => 'audio'],
            ['name' => 'Wearables', 'slug' => 'wearables'],
            ['name' => 'Computing', 'slug' => 'computing'],
            ['name' => 'Gaming', 'slug' => 'gaming'],
            ['name' => 'Mobile', 'slug' => 'mobile'],
        ];

        foreach ($categories as $category) {
            Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
