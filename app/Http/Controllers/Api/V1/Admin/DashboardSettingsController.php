<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DashboardSettingsController extends BaseApiController
{
    private array $defaults = [
        'store_name' => 'ATELYA',
        'primary_color' => '#8B7355',
        'currency' => 'MAD',
        'maintenance_mode' => false,
        'contact_email' => null,
        'hero_title' => 'ATELYA',
        'hero_subtitle' => null,
    ];

    public function show()
    {
        try {
            $settings = Setting::singleton();
            return $this->success($settings, 'Settings loaded.');
        } catch (\Throwable $e) {
            Log::warning('Dashboard settings show failed', ['error' => $e->getMessage()]);
            return $this->success($this->defaults, 'Settings fallback.');
        }
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'store_name' => ['nullable', 'string', 'max:255'],
            'primary_color' => ['nullable', 'string', 'max:20'],
            'currency' => ['nullable', 'string', 'max:10'],
            'maintenance_mode' => ['nullable', 'boolean'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string'],
        ]);

        try {
            $settings = Setting::singleton();
            $settings->update($data);
            return $this->success($settings->fresh(), 'Settings updated.');
        } catch (\Throwable $e) {
            Log::warning('Dashboard settings update failed', ['error' => $e->getMessage()]);
            return $this->success($this->defaults, 'Settings fallback.');
        }
    }
}
