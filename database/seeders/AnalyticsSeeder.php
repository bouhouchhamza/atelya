<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Order;
use App\Models\PageView;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        $paths = ['/', '/products', '/products/atelya-sonic-earbuds-pro', '/products/rogue-gaming-mouse', '/checkout'];
        $devices = ['mobile', 'desktop', 'tablet'];
        $referrers = ['https://google.com', 'https://facebook.com', 'https://instagram.com', null];
        $users = User::query()->pluck('id')->all();
        $sessions = collect(range(1, 120))->map(fn () => (string) fake()->uuid())->all();

        foreach (range(0, 29) as $dayOffset) {
            $date = Carbon::now()->subDays($dayOffset);
            $dailyViews = random_int(35, 85);

            for ($count = 0; $count < $dailyViews; $count++) {
                PageView::query()->create([
                    'session_id' => $sessions[array_rand($sessions)],
                    'user_id' => random_int(0, 100) < 28 ? $users[array_rand($users)] : null,
                    'path' => $paths[array_rand($paths)],
                    'referrer' => $referrers[array_rand($referrers)],
                    'user_agent' => fake()->userAgent(),
                    'device' => $devices[array_rand($devices)],
                    'ip_hash' => hash('sha256', fake()->ipv4()),
                    'created_at' => $date->copy()->setTime(random_int(0, 23), random_int(0, 59)),
                    'updated_at' => now(),
                ]);
            }
        }

        $products = Product::query()->where('status', 'active')->pluck('slug')->all();

        foreach (range(1, 180) as $count) {
            Event::query()->create([
                'type' => fake()->randomElement(['view_product', 'add_to_cart', 'checkout', 'purchase']),
                'payload' => [
                    'product_slug' => $products[array_rand($products)],
                    'value' => random_int(20, 700),
                ],
                'session_id' => $sessions[array_rand($sessions)],
                'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
                'updated_at' => now(),
            ]);
        }

        $orders = Order::query()->select(['id', 'order_number', 'total', 'created_at'])->get();
        foreach ($orders as $order) {
            Event::query()->create([
                'type' => 'purchase',
                'payload' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'value' => (float) $order->total,
                ],
                'session_id' => $sessions[array_rand($sessions)],
                'created_at' => $order->created_at,
                'updated_at' => now(),
            ]);
        }
    }
}
