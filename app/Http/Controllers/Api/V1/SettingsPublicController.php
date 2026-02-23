<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Setting;

class SettingsPublicController extends BaseApiController
{
    public function show()
    {
        $settings = Setting::singleton()->only([
            'store_name',
            'store_logo_url',
            'primary_color',
            'currency',
            'maintenance_mode',
            'contact_email',
            'hero_title',
            'hero_subtitle',
        ]);

        return $this->success($settings, 'Settings fetched.');
    }
}
