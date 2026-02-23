<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::query()
            ->where('role', 'customer')
            ->pluck('id')
            ->all();

        $products = Product::query()
            ->where('status', 'active')
            ->get();

        for ($index = 1; $index <= 30; $index++) {
            $itemCount = random_int(1, 4);
            $lineItems = [];
            $subtotal = 0.0;

            for ($itemIndex = 0; $itemIndex < $itemCount; $itemIndex++) {
                $product = $products->random();
                $qty = random_int(1, 3);
                $price = (float) $product->price;
                $subtotal += $price * $qty;

                $lineItems[] = [
                    'product_id' => $product->id,
                    'title_snapshot' => $product->title,
                    'price_snapshot' => $price,
                    'qty' => $qty,
                ];
            }

            $shipping = random_int(0, 1) ? 0 : 9.99;
            $tax = round($subtotal * 0.08, 2);
            $total = round($subtotal + $shipping + $tax, 2);

            $order = Order::query()->create([
                'order_number' => sprintf('AT-%06d', $index),
                'user_id' => random_int(0, 100) < 80 ? $customers[array_rand($customers)] : null,
                'customer_name' => fake()->name(),
                'customer_email' => fake()->safeEmail(),
                'status' => fake()->randomElement(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
                'subtotal' => round($subtotal, 2),
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
                'currency' => 'USD',
                'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
                'updated_at' => now(),
            ]);

            foreach ($lineItems as $lineItem) {
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'product_id' => $lineItem['product_id'],
                    'title_snapshot' => $lineItem['title_snapshot'],
                    'price_snapshot' => $lineItem['price_snapshot'],
                    'unit_price' => $lineItem['price_snapshot'],
                    'qty' => $lineItem['qty'],
                    'created_at' => $order->created_at,
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
