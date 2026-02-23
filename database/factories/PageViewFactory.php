<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PageView>
 */
class PageViewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $paths = ['/', '/products', '/products/wireless-earbuds', '/checkout', '/cart'];
        $referrers = ['https://google.com', 'https://facebook.com', 'https://instagram.com', null];
        $devices = ['mobile', 'desktop', 'tablet'];

        return [
            'session_id' => (string) fake()->uuid(),
            'user_id' => fake()->boolean(35) ? User::factory() : null,
            'path' => fake()->randomElement($paths),
            'referrer' => fake()->randomElement($referrers),
            'user_agent' => fake()->userAgent(),
            'device' => fake()->randomElement($devices),
            'ip_hash' => hash('sha256', (string) fake()->ipv4()),
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'updated_at' => now(),
        ];
    }
}
