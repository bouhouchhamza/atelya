<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Setting;

class PublicSettingController extends BaseApiController
{
    public function show()
    {
        $settings = Setting::singleton();

        return $this->success($settings, 'Settings fetched.');
    }
}
