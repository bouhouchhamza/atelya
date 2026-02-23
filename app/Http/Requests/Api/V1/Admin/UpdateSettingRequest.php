<?php

namespace App\Http\Requests\Api\V1\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'store_name' => ['required', 'string', 'max:255'],
            'store_logo_url' => ['nullable', 'url'],
            'favicon_url' => ['nullable', 'url'],
            'primary_color' => ['required', 'string', 'max:20'],
            'secondary_color' => ['nullable', 'string', 'max:20'],
            'hero_title' => ['required', 'string', 'max:255'],
            'hero_subtitle' => ['required', 'string'],
            'hero_cta_primary_text' => ['required', 'string', 'max:255'],
            'hero_cta_primary_url' => ['required', 'string', 'max:255'],
            'hero_cta_secondary_text' => ['required', 'string', 'max:255'],
            'hero_cta_secondary_url' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'tiktok' => ['nullable', 'string', 'max:255'],
            'shipping_enabled' => ['required', 'boolean'],
            'shipping_flat_rate' => ['nullable', 'numeric'],
            'tax_rate' => ['nullable', 'numeric'],
            'currency' => ['required', 'string', 'max:10'],
            'maintenance_mode' => ['required', 'boolean'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
        ];
    }
}
