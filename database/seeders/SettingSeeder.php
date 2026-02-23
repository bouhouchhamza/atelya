<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        if (Setting::query()->count() > 0) {
            return;
        }

        Setting::query()->create([
            'store_name' => 'ATELYA Electronics',
            'store_logo_url' => null,
            'favicon_url' => null,
            'primary_color' => '#8B7355',
            'secondary_color' => null,
            'hero_title' => 'Wireless Earbuds',
            'hero_subtitle' => 'Premium sound with active noise cancellation',
            'hero_cta_primary_text' => 'Shop Now',
            'hero_cta_primary_url' => '/shop',
            'hero_cta_secondary_text' => 'Learn More',
            'hero_cta_secondary_url' => '/shop',
            'contact_email' => 'support@atelya.test',
            'contact_phone' => null,
            'address' => null,
            'instagram' => null,
            'facebook' => null,
            'tiktok' => null,
            'shipping_enabled' => true,
            'shipping_flat_rate' => null,
            'tax_rate' => null,
            'currency' => 'MAD',
            'maintenance_mode' => false,
            'seo_title' => null,
            'seo_description' => null,
        ]);
    }
}
