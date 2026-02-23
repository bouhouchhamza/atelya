<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'store_name',
        'store_logo_url',
        'favicon_url',
        'primary_color',
        'secondary_color',
        'hero_title',
        'hero_subtitle',
        'hero_cta_primary_text',
        'hero_cta_primary_url',
        'hero_cta_secondary_text',
        'hero_cta_secondary_url',
        'contact_email',
        'contact_phone',
        'address',
        'instagram',
        'facebook',
        'tiktok',
        'shipping_enabled',
        'shipping_flat_rate',
        'tax_rate',
        'currency',
        'maintenance_mode',
        'seo_title',
        'seo_description',
    ];

    protected $casts = [
        'maintenance_mode' => 'boolean',
        'shipping_enabled' => 'boolean',
        'shipping_flat_rate' => 'float',
        'tax_rate' => 'float',
    ];

    public static function singleton(): self
    {
        $defaults = [
            'store_name' => 'ATELYA',
            'store_logo_url' => null,
            'favicon_url' => null,
            'primary_color' => '#8B7355',
            'secondary_color' => null,
            'hero_title' => 'ATELYA',
            'hero_subtitle' => 'Premium electronics for modern life.',
            'hero_cta_primary_text' => 'Shop Now',
            'hero_cta_primary_url' => '/shop',
            'hero_cta_secondary_text' => 'Learn More',
            'hero_cta_secondary_url' => '/shop',
            'contact_email' => 'support@atelya.test',
            'contact_phone' => null,
            'address' => null,
            'shipping_enabled' => true,
            'shipping_flat_rate' => null,
            'tax_rate' => null,
            'currency' => 'MAD',
            'maintenance_mode' => false,
            'seo_title' => null,
            'seo_description' => null,
        ];

        return static::query()->firstOrCreate(['id' => 1], $defaults);
    }
}
