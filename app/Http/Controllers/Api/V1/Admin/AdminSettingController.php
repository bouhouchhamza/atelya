<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdminSettingController extends BaseApiController
{
    public function show()
    {
        $settings = Setting::singleton();

        return $this->success($settings, 'Settings fetched.');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'store_name' => ['nullable', 'string', 'max:255'],
            'store_logo_url' => ['nullable', 'url'],
            'favicon_url' => ['nullable', 'url'],
            'primary_color' => ['nullable', 'string', 'max:20'],
            'secondary_color' => ['nullable', 'string', 'max:20'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string'],
            'hero_cta_primary_text' => ['nullable', 'string', 'max:255'],
            'hero_cta_primary_url' => ['nullable', 'string', 'max:255'],
            'hero_cta_secondary_text' => ['nullable', 'string', 'max:255'],
            'hero_cta_secondary_url' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'shipping_enabled' => ['nullable', 'boolean'],
            'shipping_flat_rate' => ['nullable', 'numeric'],
            'tax_rate' => ['nullable', 'numeric'],
            'currency' => ['nullable', 'string', 'max:10'],
            'maintenance_mode' => ['nullable', 'boolean'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
        ]);

        $settings = Setting::singleton();
        $settings->update($data);

        return $this->success($settings->fresh(), 'Settings updated.');
    }
}
