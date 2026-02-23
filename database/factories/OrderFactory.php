<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 60, 2400);
        $shipping = fake()->boolean(40) ? 0 : fake()->randomFloat(2, 5, 40);
        $tax = round($subtotal * 0.08, 2);

        return [
            'order_number' => 'AT-' . strtoupper(fake()->bothify('######')),
            'user_id' => fake()->boolean(85) ? User::factory() : null,
            'status' => fake()->randomElement(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => round($subtotal + $shipping + $tax, 2),
            'currency' => 'USD',
            'created_at' => fake()->dateTimeBetween('-45 days', 'now'),
            'updated_at' => now(),
        ];
    }
}
