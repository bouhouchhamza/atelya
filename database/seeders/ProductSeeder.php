<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoryIds = Category::query()->pluck('id', 'slug');

        $products = [
            ['title' => 'ATELYA Sonic Earbuds Pro', 'slug' => 'atelya-sonic-earbuds-pro', 'description' => 'Premium ANC earbuds with spatial audio and low-latency mode.', 'price' => 189.00, 'compare_at_price' => 219.00, 'sku' => 'ATL-EAR-001', 'stock' => 42, 'status' => 'active', 'category_id' => $categoryIds['audio']],
            ['title' => 'PulseBeat Wireless Headphones', 'slug' => 'pulsebeat-wireless-headphones', 'description' => 'Over-ear studio profile with adaptive noise cancellation.', 'price' => 259.00, 'compare_at_price' => 299.00, 'sku' => 'ATL-AUD-002', 'stock' => 18, 'status' => 'active', 'category_id' => $categoryIds['audio']],
            ['title' => 'Echo Mini Speaker', 'slug' => 'echo-mini-speaker', 'description' => 'Portable speaker with deep bass and all-day battery.', 'price' => 119.00, 'compare_at_price' => null, 'sku' => 'ATL-AUD-003', 'stock' => 9, 'status' => 'active', 'category_id' => $categoryIds['audio']],
            ['title' => 'Aero Smartwatch S', 'slug' => 'aero-smartwatch-s', 'description' => 'Health metrics, GPS, and AMOLED panel in lightweight body.', 'price' => 229.00, 'compare_at_price' => 269.00, 'sku' => 'ATL-WEA-001', 'stock' => 31, 'status' => 'active', 'category_id' => $categoryIds['wearables']],
            ['title' => 'Aero Smartwatch X', 'slug' => 'aero-smartwatch-x', 'description' => 'Rugged smartwatch with 10-day battery and offline maps.', 'price' => 329.00, 'compare_at_price' => null, 'sku' => 'ATL-WEA-002', 'stock' => 6, 'status' => 'active', 'category_id' => $categoryIds['wearables']],
            ['title' => 'Stride Fitness Band', 'slug' => 'stride-fitness-band', 'description' => 'Slim band focused on recovery score and sleep quality.', 'price' => 79.00, 'compare_at_price' => 99.00, 'sku' => 'ATL-WEA-003', 'stock' => 55, 'status' => 'active', 'category_id' => $categoryIds['wearables']],
            ['title' => 'Typemaster Mechanical Keyboard', 'slug' => 'typemaster-mechanical-keyboard', 'description' => 'Hot-swappable mechanical keyboard tuned for productivity.', 'price' => 149.00, 'compare_at_price' => 179.00, 'sku' => 'ATL-COM-001', 'stock' => 27, 'status' => 'active', 'category_id' => $categoryIds['computing']],
            ['title' => 'Airstep Wireless Mouse', 'slug' => 'airstep-wireless-mouse', 'description' => 'Precision wireless mouse with silent switches.', 'price' => 89.00, 'compare_at_price' => null, 'sku' => 'ATL-COM-002', 'stock' => 63, 'status' => 'active', 'category_id' => $categoryIds['computing']],
            ['title' => 'Orbit USB-C Dock', 'slug' => 'orbit-usb-c-dock', 'description' => 'Dual 4K dock with ethernet, SD, and high-speed ports.', 'price' => 139.00, 'compare_at_price' => 169.00, 'sku' => 'ATL-COM-003', 'stock' => 22, 'status' => 'active', 'category_id' => $categoryIds['computing']],
            ['title' => 'Rogue Gaming Mouse', 'slug' => 'rogue-gaming-mouse', 'description' => 'Ultra-light FPS mouse with high polling precision.', 'price' => 109.00, 'compare_at_price' => 129.00, 'sku' => 'ATL-GAM-001', 'stock' => 44, 'status' => 'active', 'category_id' => $categoryIds['gaming']],
            ['title' => 'Nova TKL Keyboard', 'slug' => 'nova-tkl-keyboard', 'description' => 'Compact gaming keyboard with rapid trigger switches.', 'price' => 169.00, 'compare_at_price' => null, 'sku' => 'ATL-GAM-002', 'stock' => 13, 'status' => 'active', 'category_id' => $categoryIds['gaming']],
            ['title' => 'Prism RGB Mousepad XL', 'slug' => 'prism-rgb-mousepad-xl', 'description' => 'Extended mousepad with dynamic RGB edge lighting.', 'price' => 49.00, 'compare_at_price' => null, 'sku' => 'ATL-GAM-003', 'stock' => 72, 'status' => 'active', 'category_id' => $categoryIds['gaming']],
            ['title' => 'Volt 65W GaN Charger', 'slug' => 'volt-65w-gan-charger', 'description' => 'Compact USB-C GaN charger for phone, tablet, and laptop.', 'price' => 59.00, 'compare_at_price' => 79.00, 'sku' => 'ATL-MOB-001', 'stock' => 84, 'status' => 'active', 'category_id' => $categoryIds['mobile']],
            ['title' => 'Flex USB-C Cable 2m', 'slug' => 'flex-usb-c-cable-2m', 'description' => 'Durable braided cable with 100W fast-charge support.', 'price' => 19.00, 'compare_at_price' => null, 'sku' => 'ATL-MOB-002', 'stock' => 150, 'status' => 'active', 'category_id' => $categoryIds['mobile']],
            ['title' => 'MagDock Wireless Stand', 'slug' => 'magdock-wireless-stand', 'description' => 'Magnetic charging stand optimized for desk setup.', 'price' => 69.00, 'compare_at_price' => 89.00, 'sku' => 'ATL-MOB-003', 'stock' => 5, 'status' => 'draft', 'category_id' => $categoryIds['mobile']],
        ];

        foreach ($products as $product) {
            $product['name'] = $product['title'];
            $product['is_featured'] = in_array($product['slug'], [
                'atelya-sonic-earbuds-pro',
                'aero-smartwatch-s',
                'typemaster-mechanical-keyboard',
                'rogue-gaming-mouse',
            ], true);

            Product::query()->updateOrCreate(
                ['slug' => $product['slug']],
                $product
            );
        }
    }
}
