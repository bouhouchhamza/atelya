<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['view_product', 'add_to_cart', 'checkout', 'purchase']),
            'payload' => [
                'product_slug' => fake()->slug(3),
                'amount' => fake()->randomFloat(2, 10, 1400),
            ],
            'session_id' => (string) fake()->uuid(),
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'updated_at' => now(),
        ];
    }
}
